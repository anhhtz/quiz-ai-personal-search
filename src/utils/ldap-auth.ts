import { Client } from 'ldapts';
import cache from './cache';
import { fluentLogger } from './logger';
const crypto = require('crypto');

const LDAP_SERVERS = [
    // '10.211.0.77',
    '10.128.58.11',
    '10.128.58.12',
    '10.128.58.13',
    '10.128.58.14',
    '10.128.58.15',
    '10.0.58.11',
    '10.0.58.12',
    '10.0.58.13',
    '10.0.58.14',
]

export async function authenticate(username: string, password: string) {

    try {
        const passwordHashed = crypto.createHash('md5').update(password).digest('hex');
        const cacheKey = `ldap_account_${username}_${passwordHashed}`;
        
        // check cache first
        const cachedAccount = await getLdapAccountFromCache(cacheKey);
        if (cachedAccount) {
            fluentLogger.info().message('LDAP account retrieved from cache').data({ username, cacheKey }).service({ type: 'utils', name: 'ldapts' }).function({ name: 'authenticate', path: 'src/utils/ldap-auth.ts' }).log();
            return cachedAccount;
        }
        // If not found in cache, proceed with LDAP authentication
        fluentLogger.info().message('LDAP authentication started').data({ username }).service({ type: 'utils', name: 'ldapts' }).function({ name: 'authenticate', path: 'src/utils/ldap-auth.ts' }).log();

        for (const server of LDAP_SERVERS) {
            const user = await authenticateWithServer(server, username, password);
            if (user) {
                // Cache the user account for future requests
                await setLdapAccountToCache(username, user);
                fluentLogger.info().message('LDAP account cached successfully').data({ username }).service({ type: 'utils', name: 'ldapts' }).function({ name: 'authenticate', path: 'src/utils/ldap-auth.ts' }).log();
                return user;
            }
            return null;
        }
    } catch (error) {
        console.error('Authentication failed:', error);
        fluentLogger.error().message('[EXCEPTION] LDAP authentication failed').data({ error, username }).service({ type: 'utils', name: 'ldapts' }).function({ name: 'authenticate', path: 'src/utils/ldap-auth.ts' }).log();
        return null
    }
}

const authenticateWithServer = async (server: string, username: string, password: string): Promise<any> => {
    const client = new Client({
        url: `ldap://${server}`,
    });

    try {
        // Attempt to bind to the LDAP server with the provided credentials
        await client.bind(`${username}@agribank.com.vn`, password);
        fluentLogger.info().message('LDAP authentication successful').data({ username }).service({ type: 'utils', name: 'ldapts', ldap: { server } }).function({ name: 'authenticateWithServer', path: 'src/utils/ldap-auth.ts' }).log();

        // Fetch user details after successful authentication
        const emailFilter = `(mail=${username}@agribank.com.vn)`;
        const searchResults = await client.search('dc=corp,dc=agribank,dc=com,dc=vn', {
            scope: 'sub',
            filter: emailFilter,
            attributes: [
                "dn", "sn", "cn", "givenName", "name", "displayName", "description",
                "mail", "mailNickname", "userPrincipalName", "distinguishedName", // corrected mailNickname
                "memberOf", "pwdLastSet", "badPwdCount", "msDS-UserPasswordExpiryTimeComputed",
                "msExchUMDtmfMap", "sAMAccountName", "mobile",
                "msDS-User-Account-Control-Computed", "userAccountControl"
            ],
        });

        return searchResults.searchEntries[0]; // Return user information
    } catch (error) {
        fluentLogger.error().message('[EXCEPTION] LDAP authentication failed').data({ error, username }).service({ type: 'utils', name: 'ldapts', ldap: { server } }).function({ name: 'authenticateWithServer', path: 'src/utils/ldap-auth.ts' }).log();
        // throw error; // Rethrow the error for further handling
        return null
    } finally {
        await client.unbind(); // Ensure to unbind after the operation
    }
};

const getLdapAccountFromCache = async (cacheKey: string): Promise<any | null> => {
    try {
        const cached = await cache.get(cacheKey);
        if (cached) {
            return cached;
        }
        return null;
    }
    catch (error) {
        fluentLogger.error().message('[EXCEPTION] Failed to get LDAP account from cache').data({ error, cacheKey }).service({ type: 'utils', name: 'ldap-auth' }).function({ name: 'getLdapAccountFromCache', path: 'src/utils/ldap-auth.ts' }).log();
        return null;
    }
}
const setLdapAccountToCache = async (cacheKey: string, account: any): Promise<void> => {

    try {
        await cache.set(`cacheKey`, account, 60 * 60 * 24); // Cache for 24 hours
        fluentLogger.info().message('LDAP account set to cache').data({ cacheKey, account }).service({ type: 'utils', name: 'ldap-auth' }).function({ name: 'setLdapAccountToCache', path: 'src/utils/ldap-auth.ts' }).log();
    } catch (error) {
        fluentLogger.error().message('[EXCEPTION] Failed to set LDAP account to cache').data({ error, cacheKey, account }).service({ type: 'utils', name: 'ldap-auth' }).function({ name: 'setLdapAccountToCache', path: 'src/utils/ldap-auth.ts' }).log();
    }
}