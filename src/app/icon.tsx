import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default async function Icon() {
    // Fetch the Monoton font from Google Fonts GitHub repo directly to ensure it can be bundled/rendered
    const fontData = await fetch(
        'https://raw.githubusercontent.com/google/fonts/main/ofl/monoton/Monoton-Regular.ttf'
    ).then((res) => res.arrayBuffer());

    return new ImageResponse(
        (
            <div
                style={{
                    fontSize: 28,
                    background: 'transparent',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#c8a96e',
                }}
            >
                M
            </div>
        ),
        {
            ...size,
            fonts: [
                {
                    name: 'Monoton',
                    data: fontData,
                    style: 'normal',
                },
            ],
        }
    );
}
