import { type DefaultSession, type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
// import Credentials from "next-auth/providers/credentials";
// import { logger } from "./logger";
import { LoginProvider } from "@/types/enums";
import { createLoggerWithContext, fluentLogger } from "./logger";

/**
 * 
 */
const logger = createLoggerWithContext({
    service: 'next-auth',

});
declare module 'next-auth' {
    interface Session {
        user: {
            sub: string, // this is the user id from Auth0
            sid: string, // this is the user id from DB
            aliasName: string,
            fullName: string,
            roles: number[], // add more roles
            // ...
            status: number,
            isActive: boolean,
            loginProvider: LoginProvider,
            isGoogleAccountLinked: boolean,
        }
        & DefaultSession['user']
    }
}

export const authOptions: NextAuthOptions = {

    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        // Google login
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
            // Add profile fields we want to access
            profile(profile) {
                return {
                    id: profile.sub,
                    email: profile.email,
                    name: profile.name,
                    image: profile.picture,
                }
            }

        }),

    ],
    pages: {
        signIn: '/auth',
        // error: '/auth/error',
    },
    callbacks: {
        /**
         * 
         * @param param0 
         * @returns 
         */
        async signIn({ user, account, profile, email, credentials }) {
            fluentLogger.info().identify({ email, user, account, profile, credentials }).message('User signIn').service({ type: 'utils/auth', name: 'authOptions.callbacks.signIn' }).function({ name: 'signIn', path: 'src/utils/auth.ts' }).log();

            try {
                // Google
                if (account?.provider === "google") {

                }
                return true


            } catch (error) {
                // logger.error(`[EXCEPTION]`, { error });
                fluentLogger.error().identify({ email, user, account, profile, credentials }).message(`[EXCEPTION] ${error}`).data({ error }).service({ type: 'utils/auth', name: 'authOptions.callbacks.signIn' }).log();
                return false;
            }
        },

        /**
         * jwt
         * @param param0 
         * @returns 
         */
        async jwt({ token, user, account, profile, session }) {
            // logger.warn(`===== jwt (begin) =====> ${JSON.stringify({ token, user, account, profile, session })}`);


            // logger.warn(`===== jwt (end) =====> ${JSON.stringify({ token, user, account, profile, session })}`);
            return token;
        },

        /**
         * session
         * @param param0 
         * @returns 
         */
        async session({ session, token, user }) {
            // logger.warn(`===== session (start) =====> ${JSON.stringify({ session, token, user })}`);

            if (token && token.user) {
                session.user = {
                    ...session.user,
                    ...token.user
                }
            }
            // logger.warn(`===== session (end) =====> ${JSON.stringify({ session, token, user })}`);

            return session;
        },

        async redirect({ url, baseUrl }) {
            // Allows relative callback URLs
            if (url.startsWith("/")) return `${baseUrl}${url}`
            // Allows callback URLs on the same origin
            else if (new URL(url).origin === baseUrl) return url
            return baseUrl
        },

    },
    session: {
        strategy: "jwt",
    },

    // debug: process.env.NODE_ENV === 'development',
};

