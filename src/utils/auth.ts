import { getServerSession, type DefaultSession, type NextAuthOptions } from "next-auth";
import Auth0 from "next-auth/providers/auth0";
import GoogleProvider from "next-auth/providers/google";
// import Credentials from "next-auth/providers/credentials";
import { accountService } from "@/services/account/account-service";
// import { logger } from "./logger";
import { emailWhitelist } from "@/config/auth-config";
import * as userService from "@/services/account/user-service";
import { getUserLoginMethodsByEmail } from "@/services/auth/auth-service";
import { LoginProvider } from "@/types/enums";
import CredentialsProvider from "next-auth/providers/credentials";
import cache from "./cache";
import { authenticate } from "./ldap-auth";
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
        CredentialsProvider({
            name: "LDAP Credentials",
            id: 'ldap_credentials',
            credentials: {
                email: { type: "text" },
                password: { type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                const ldapAccount = await authenticate(credentials.email, credentials.password);

                if (!ldapAccount) {
                    fluentLogger.error().identify({ email: credentials.email }).message('[LDAP Login] Invalid credentials').service({ type: 'utils/ldap', name: 'ldap_credentials' }).function({ name: 'authOptions.providers.credentials.authorize', path: 'src/utils/auth.ts' }).log();
                    return null;
                }

                // ldap authentication successful, fetch user details by email and provider
                const userDetails = await getHcaUserDetails(ldapAccount.mail);

                if (!userDetails) {
                    fluentLogger.error().identify({ email: ldapAccount.mail, providerUserId: ldapAccount.sAMAccountName }).message('[LDAP Login] User not found or inactive').service({ type: 'utils/ldap', name: 'ldap_credentials' }).function({ name: 'authOptions.providers.credentials.authorize', path: 'src/utils/auth.ts' }).log();
                    return null;
                }
                fluentLogger.info().identify({ email: ldapAccount.mail, providerUserId: ldapAccount.sAMAccountName }).message('[LDAP Login] User authenticated successfully').service({ type: 'utils/ldap', name: 'ldap_credentials' }).function({ name: 'authOptions.providers.credentials.authorize', path: 'src/utils/auth.ts' }).log();
                // log success
                return {
                    id: userDetails.Sid, // use Sid as id
                    sid: userDetails.Sid, // use Sid as sid
                    email: userDetails.Email,
                    name: userDetails.Fullname || userDetails.FirstName,
                    fullName: userDetails.Fullname || userDetails.FirstName,
                    aliasName: userDetails.FirstName || userDetails.Fullname,
                    image: `https://www.gravatar.com/avatar/${encodeURIComponent(userDetails.Email || '')}?d=identicon`,
                    username: ldapAccount.sAMAccountName, // use sAMAccountName as username
                    roles: [], // add roles from user details
                    isActive: true, // default for LDAP login
                    loginProvider: LoginProvider.Ldap, // specify login provider
                }
                // return {
                //     id: ldapAccount.sAMAccountName,
                //     email: ldapAccount.mail,
                //     name: ldapAccount.name || ldapAccount.cn,
                //     fullName: ldapAccount.name || ldapAccount.cn || ldapAccount.displayName,
                //     aliasName: ldapAccount.displayName || ldapAccount.name || ldapAccount.cn,
                //     image: `https://www.gravatar.com/avatar/${encodeURIComponent(ldapAccount.mail || '')}?d=identicon`,
                //     sid: ldapAccount.distinguishedName, // use distinguishedName as sid
                //     username: ldapAccount.sAMAccountName, // use sAMAccountName as username
                // };

            }
        }),
        Auth0({
            clientId: process.env.AUTH0_CLIENT_ID as string,
            clientSecret: process.env.AUTH0_CLIENT_SECRET as string,
            issuer: process.env.AUTH0_ISSUER || "",
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
                    //=================================
                    // Flow for linking Google account
                    //=================================
                    // Get the current session to check if user is already logged in
                    const session = await getServerSession(authOptions);
                    // If user is logged in, this is a linking attempt
                    if (session?.user?.sid || session?.user?.sub) {
                        fluentLogger.info().identify({ email, id: session.user.sid, sub: session.user.sub, }).message('[Linking Google] User is already logged in').service({ type: 'utils/auth', name: 'authOptions.callbacks.signIn' }).log();
                        return `/api/auth/link-google?email=${encodeURIComponent(user.email!)}&sub=${user.id}`;
                    }

                    const gmail = user.email;
                    if (!gmail) {
                        // logger.error(`[Google Login] Gmail is null`, { user, _trace: { function: 'auth.authOptions.callbacks.signIn' } });
                        fluentLogger.error().identify({ email, user, }).message('[Google Login] Gmail is null').service({ type: 'utils/auth', name: 'authOptions.callbacks.signIn' }).log();
                        return false;
                    }
                    //==================================
                    // Flow Regular Google sign in flow
                    //==================================
                    const isLinked = await accountService.isGoogleAccountLinked(user.id, gmail);
                    fluentLogger.info().identify({ email, id: user.id, sub: user.id, }).message('[Google Login] User is not linked').data({ email: gmail, isLinked }).service({ type: 'utils/auth', name: 'authOptions.callbacks.signIn' }).log();

                    if (isLinked) {
                        // get user login info mapping

                        const userDetails = await fetchUserDetails(gmail, user.id, LoginProvider.Google);
                        //
                        if (!userDetails || !userDetails.user || !userDetails.user.IsActive) {
                            // not exists user or inactive
                            return false
                        }
                        // sign in success
                        return true;
                    }
                    // Not linked - redirect to verify Agribank email page
                    // return `/auth/verify-agribank?googleEmail=${encodeURIComponent(user.email!)}&googleId=${user.id}`;
                    // Not linked - redirect message page
                    return '/auth/error/account-not-linked';
                }

                // Auth0
                if (account?.provider === "auth0") {
                    if (user) {
                        const { id, email } = user;
                        const userDetails = await fetchUserDetails(email!, id, LoginProvider.Auth0);
                        fluentLogger.info().identify({ email, id, userDetails }).message('[Auth0 Login]').service({ type: 'utils/auth', name: 'authOptions.callbacks.signIn' }).log();

                        if (!userDetails || !userDetails.user || !userDetails.user.Email) return false;

                        if (userDetails.user.Email === email) {
                            return true;
                        }
                        else {
                            return '/errors/unauthorized';
                        }
                    }
                    return false;
                }

                // ldap_credentials
                if (account?.provider === "ldap_credentials") {
                    if (user) {
                        return true
                    }
                    else {
                        return '/errors/unauthorized';
                    }


                }
                return false;
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

            let loginProvider = 0; // Default to unknown provider
            switch (account?.provider) {
                case "google":
                    loginProvider = LoginProvider.Google;
                    break;
                case "auth0":
                    loginProvider = LoginProvider.Auth0;
                    break;
                case "ldap_credentials":
                    loginProvider = LoginProvider.Ldap;
                    break;
                default:
                    break;
            }
            const { email, sub: id } = token

            if (email && id) {
                // Google OAuth2 & Auth0
                // get link status for later usage
                const userLoginInfos = await getUserLoginMethodsByEmail(email);
                const isGoogleAccountLinked = userLoginInfos?.UserLoginInfos.some(item => item.LoginProvider === LoginProvider.Google);

                // fetch user detail following login provider
                const userDetails = await fetchUserDetails(email!, id, loginProvider)

                if (userDetails && userDetails.user) {
                    return {
                        ...token,
                        user: {
                            sid: userDetails.user.Sid,
                            name: userDetails.user.Fullname,
                            aliasName: userDetails.user.FirstName,
                            fullName: userDetails.user.Fullname,
                            isActive: userDetails.user.IsActive,
                            roles: userDetails?.roles || [],
                            loginProvider,
                            isGoogleAccountLinked,
                        }
                    };
                }
            }
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

async function fetchUserDetails(email: string, providerUserId: string, loginProvider: LoginProvider) {
    if (!email) return null;
    const _email = email.toLowerCase();

    try {
        // // check cache first
        const cachedUserDetails = await cache.get(`user_details_${email}_${providerUserId}_${loginProvider}`);

        if (cachedUserDetails) {
            fluentLogger.info().identify({ email, providerUserId, loginProvider }).message('Get user details from cache').service({ name: 'auth' }).function({ name: 'fetchUserDetails', path: 'src/utils/auth.ts' }).data({ cachedUserDetails }).log();
            return JSON.parse(cachedUserDetails);
        }

        // fetch from db
        if (loginProvider === LoginProvider.Auth0 || loginProvider === LoginProvider.Google) {
            const userDetails = await accountService.getUserDetailsByEmailLoginProvider(_email, providerUserId, loginProvider);
            if (!userDetails) return null;
            fluentLogger.info().identify({ _email, providerUserId, loginProvider }).message('Get user details from Db').service({ name: 'auth' }).function({ name: 'fetchUserDetails', path: 'src/utils/auth.ts' }).data({ userDetails }).log();

            // cache user details
            await cache.set(`user_details_${email}_${providerUserId}_${loginProvider}`, JSON.stringify(userDetails), 60 * 60 * 1); // 1 hour

            // return user details
            return userDetails;
        }

        if (loginProvider === LoginProvider.Ldap) {
            const userDetails = await userService.getUserByEmail(_email);
            if (!userDetails) return null
            fluentLogger.info().identify({ _email, providerUserId, loginProvider }).message('Get user details from Db').service({ name: 'auth' }).function({ name: 'getUserByEmail', path: 'src/utils/auth.ts' }).data({ userDetails }).log();
            return { user: userDetails, roles: [], branch: null };
        }
        return null;
    }
    catch (error) {
        fluentLogger.error().identify({ _email, providerUserId, loginProvider }).message(`EXCEPTION: Error: ${(error as Error)?.message}`).data({ error }).service({ name: 'auth' }).function({ name: 'fetchUserDetails', path: 'src/utils/auth.ts' }).data({ error }).log();
        return null;
    }
}

async function getHcaUserDetails(email: string) {
    if (!email) return null;
    // check email in whitelist
    const isWhitelisted = emailWhitelist.includes(email.toLowerCase());
    if (!isWhitelisted) {
        fluentLogger.error().identify({ email: email.toLowerCase() }).message('Email not in whitelist').service({ name: 'auth' }).function({ name: 'getHcaUserDetails', path: 'src/utils/auth.ts' }).log();
    }

    return await userService.getUserByEmail(email.toLowerCase());
    // return null;
}