export interface LdapAccount {
    dn: string;
    cn: string;
    sn: string;
    description: string;
    givenName: string;
    distinguishedName: string;
    displayName: string;
    memberOf: string[];
    name: string;
    userAccountControl: string;
    badPwdCount: string;
    pwdLastSet: string;
    sAMAccountName: string;
    userPrincipalName: string;
    'msDS-User-Account-Control-Computed': string;
    'msDS-UserPasswordExpiryTimeComputed': string;
    mail: string;
    mobile: string;
    mailNickname: string;  // correct lowercase 'n' version
    msExchUMDtmfMap: string[];
}