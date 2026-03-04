import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                    // We need these scopes to read albums and media items.
                    scope: "openid email profile https://www.googleapis.com/auth/photoslibrary.readonly",
                },
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, account }) {
            // Persist the OAuth access_token right after signin
            if (account) {
                console.log("[NextAuth] New account sign-in:", JSON.stringify({
                    scope: account.scope,
                    token_type: account.token_type,
                    has_access_token: !!account.access_token,
                }));
                token.accessToken = account.access_token;
                token.scope = account.scope;
            }
            return token;
        },
        async session({ session, token }: any) {
            // Send properties to the client, like an access_token from a provider.
            session.accessToken = token.accessToken;
            return session;
        },
    },
    // We can restrict only the Admin email here later if we want to guard access,
    // but the Firebase login system already guards the dashboard.
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
