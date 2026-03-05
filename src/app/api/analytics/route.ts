import { NextResponse } from 'next/server';
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

// Initialize the client outside the handler so it can be reused
// It will only be instantiated if credentials exist
const createClient = () => {
    try {
        if (!process.env.GA_PROPERTY_ID || !process.env.GA_CLIENT_EMAIL || !process.env.GA_PRIVATE_KEY) {
            return null;
        }
        return new BetaAnalyticsDataClient({
            credentials: {
                client_email: process.env.GA_CLIENT_EMAIL,
                private_key: process.env.GA_PRIVATE_KEY.replace(/\\n/g, '\n'),
            },
        });
    } catch (e) {
        console.error("Failed to initialize GA client:", e);
        return null;
    }
};

const analyticsClient = createClient();

export async function GET(request: Request) {
    // 1. Authenticate Admin session
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Check Configuration
    const propertyId = process.env.GA_PROPERTY_ID;
    if (!analyticsClient || !propertyId) {
        return NextResponse.json(
            { error: 'Google Analytics credentials are not configured in environment variables.' },
            { status: 503 }
        );
    }

    try {
        const { searchParams } = new URL(request.url);
        const startDate = searchParams.get('startDate') || '30daysAgo';
        const endDate = searchParams.get('endDate') || 'today';

        // Fetch primary timeline (Users, Views, Sessions, Bounce Rate)
        const [timelineResponse] = await analyticsClient.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate, endDate }],
            dimensions: [{ name: 'date' }],
            metrics: [
                { name: 'activeUsers' },
                { name: 'screenPageViews' },
                { name: 'sessions' },
                { name: 'bounceRate' },
            ],
            orderBys: [
                {
                    dimension: { dimensionName: 'date' },
                    desc: false,
                }
            ]
        });

        const timeline = timelineResponse.rows?.map(row => {
            const dateStr = row.dimensionValues?.[0]?.value || '';
            const formattedDate = dateStr.length === 8
                ? `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`
                : dateStr;

            return {
                date: formattedDate,
                activeUsers: parseInt(row.metricValues?.[0]?.value || '0', 10),
                pageViews: parseInt(row.metricValues?.[1]?.value || '0', 10),
                sessions: parseInt(row.metricValues?.[2]?.value || '0', 10),
                bounceRate: parseFloat(row.metricValues?.[3]?.value || '0') * 100,
            };
        }) || [];

        // Fetch Top Pages
        const [pagesResponse] = await analyticsClient.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate, endDate }],
            dimensions: [{ name: 'pagePath' }],
            metrics: [{ name: 'screenPageViews' }],
            orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
            limit: 10,
        });

        const topPages = pagesResponse.rows?.map(row => ({
            path: row.dimensionValues?.[0]?.value || '',
            views: parseInt(row.metricValues?.[0]?.value || '0', 10)
        })) || [];

        // Fetch Top Countries
        const [countriesResponse] = await analyticsClient.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate, endDate }],
            dimensions: [{ name: 'country' }],
            metrics: [{ name: 'activeUsers' }],
            orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
            limit: 5,
        });

        const topCountries = countriesResponse.rows?.map(row => ({
            country: row.dimensionValues?.[0]?.value || 'Unknown',
            users: parseInt(row.metricValues?.[0]?.value || '0', 10)
        })) || [];

        // Fetch Device Categories
        const [devicesResponse] = await analyticsClient.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate, endDate }],
            dimensions: [{ name: 'deviceCategory' }],
            metrics: [{ name: 'activeUsers' }],
            orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
        });

        const devices = devicesResponse.rows?.map(row => ({
            category: row.dimensionValues?.[0]?.value || 'Unknown',
            users: parseInt(row.metricValues?.[0]?.value || '0', 10)
        })) || [];

        return NextResponse.json({
            timeline,
            topPages,
            topCountries,
            devices
        });

    } catch (error: any) {
        console.error('GA Data API Error:', error);
        return NextResponse.json({ error: error.message || 'Failed to fetch analytics data' }, { status: 500 });
    }
}
