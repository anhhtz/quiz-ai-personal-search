/*
    Account Service
*/

import { LoginProvider, ObjectStatus, RoleType } from "@/types/enums";
import { prisma } from "@/utils/db";
import { logger } from "@/utils/logger";


/**
 * get user details by email (from email `UserLoginInfos` instead of `Users`)
 * @param email 
 * @param loginProvider 
 * @returns 
 */
const getUserDetailsByEmailLoginProvider = async (email: string, providerUserId: string, loginProvider: LoginProvider) => {
    if (!email) return null;

    let user = null;
    let roles = null;
    let branch = null;

    try {
        user = await prisma.userLoginInfos.findFirst({
            where: {
                LoginProvider: loginProvider,
                ObjectStatus: ObjectStatus.ReadyToUse,
                // email or providerUserId
                OR: [
                    {
                        Email: email
                    },
                    {
                        ProviderUserId: providerUserId
                    }
                ]
            },


            select: {
                Users: {
                    select: {
                        Sid: true,
                        Code: true,
                        FirstName: true,
                        LastName: true,
                        Fullname: true,
                        Gender: true,
                        Birthday: true,
                        Phone: true,
                        Address: true,
                        Email: true,

                        IsActive: true,
                        LatestLoginDate: true,
                        LatestLoginIP: true,

                        // UserRoles: {
                        //     select: {
                        //         RoleType: true
                        //     }
                        // }
                    }
                },
            }
        })

        if (user && user.Users) {
            // get user roles
            const _roles = await prisma.userRoles.findMany({
                where: {
                    UserSid: user.Users.Sid,
                    ObjectStatus: ObjectStatus.ReadyToUse
                },
                select: {
                    RoleType: true
                }
            })
            if (_roles) {
                roles = _roles.map((r: { RoleType: any; }) => r.RoleType);
            }

            // get organization
            branch = await getOrganizationByUserSid(user.Users.Sid);
        }

        return { user: user?.Users, roles, branch };
    } catch (error) {
        logger.error(`[service.account.google-oauth2-service][getUserByEmailLoginProvider]: ${JSON.stringify(error)}`);
        return null;
    }
}

/**
 * Check if Google account is linked to Agribank account
 * @param id 
 * @param email 
 * @returns 
 */

const isGoogleAccountLinked = async (id: string, email: string): Promise<boolean> => {
    if (!id || !email) {
        return false;
    }

    const linkedAccount = await prisma.userLoginInfos.findFirst({
        where: {
            ProviderUserId: id,
            Email: email,
            LoginProvider: LoginProvider.Google,
            ObjectStatus: ObjectStatus.ReadyToUse,
            Users: {
                IsActive: true,
                ObjectStatus: ObjectStatus.ReadyToUse
            }
        },
        include: {
            Users: {
                select: {
                    Email: true,
                }
            }
        }
    });
    return !!linkedAccount?.Users?.Email;
}

/**
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * NEED REVIEW & UPDATE
 */
/**
 * Get account details by Login provider
 * @param email 
 * @param providerUserId 
 * @param loginProvider 
 */
const getAccountDetails = async (email: string, providerUserId: string, loginProvider: number) => {
    const accountDetails = await getAccountDetailsFromDb(email, providerUserId, loginProvider)

    if (accountDetails) {
        logger.info(`[services.account.account-service.getAccountDetails] accountDetail from Db: ${email} | ${JSON.stringify(accountDetails)}`)
    }

    return accountDetails;
}




//=================================
// Account - Database service
//=================================
/**
 * get organization by code
 * @param branchCode 
 * @returns Organization
 */
const getOrganizationByCode = async (branchCode: string) => {
    return await prisma.organizations.findFirst({
        where: {
            BranchCode: branchCode,
            ObjectStatus: ObjectStatus.ReadyToUse
        },
        select: {
            Sid: true,
            BranchCode: true,
            BranchName: true
        }
    })
}

/**
 * 
 * @param userSid 
 * @param branchCode 
 * @param fullname 
 * @param displayName 
 * @param agribankEmployeeNo 
 * @param mobilePhone 
 */
const updateProfile = async (userSid: string, branchCode: string, fullname: string, displayName: string, agribankEmployeeNo: string, mobilePhone: string) => {
    let result = null

    const userUpdated = await prisma.users.update({
        where: {
            Sid: userSid,
            NOT: {
                ObjectStatus: ObjectStatus.Obsoleted
            }
        },
        data: {
            Fullname: fullname,
            FirstName: displayName,
            Code: agribankEmployeeNo,
            Phone: mobilePhone,

            UpdatedAt: new Date().toISOString(),
            UpdatedBy: userSid
        },
        select: {
            Sid: true,
            Email: true,
            Fullname: true,
            FirstName: true,
            Code: true,
            Phone: true
        }
    })

    if (!userUpdated) {
        logger.info(`[services.account.account-service.updateProfile] userUpdated: null/undefined | UserSid: [${userSid}]`)
        return { accountUpdated: null, organizationUpdated: null }
    }

    // add to result
    result = { accountUpdated: { isSuccess: true } }

    // get branch by code
    const branch = await getOrganizationByCode(branchCode);

    if (branch) {
        logger.info(`[services.account.account-service.updateProfile] branch: ${branch.BranchCode} | ${branch.BranchName}`)
        // create user Organization
        //check exist
        const countUserOrganization = await prisma.organizationMembers.count({
            where: {
                UserSid: userSid,
                OrganizationSid: branch.Sid,
                ObjectStatus: ObjectStatus.ReadyToUse,
                IsActive: true
            }
        })

        if (countUserOrganization <= 0) { // not found any record => create new one
            const organizationMemberCreated = await prisma.organizationMembers.create({
                data: {
                    Sid: crypto.randomUUID(),
                    UserSid: userSid,
                    OrganizationSid: branch.Sid,

                    IsActive: true,
                    ObjectStatus: ObjectStatus.ReadyToUse,

                    CreatedAt: new Date().toISOString(),
                    UpdatedAt: new Date().toISOString(),
                },
                select: {
                    Sid: true,
                    UserSid: true,
                    OrganizationSid: true,
                    IsActive: true
                }
            })

            //add to result
            result = { ...result, organizationUpdated: { isSuccess: organizationMemberCreated ? true : false } }
        } else { // organization found
            logger.info(`[services.account.account-service.updateProfile] userOrganization: found | UserSid: [${userSid}] | OrganizationSid: [${branch.Sid}]`)
            // result = { ...result, organizationUpdated: {isSuccess: true} }
        }
    } else { // branch not found
        logger.info(`[services.account.account-service.updateProfile] branch: null/undefined | : [${branchCode}]`)
        result = { ...result, organizationUpdated: { isSuccess: false, message: `Branch not found: [${branchCode}]` } }
    }

    return result
}
/**
 * Get account details from database, including user roles and organization
 * @param email 
 * @param providerUserSid 
 * @param loginProvider 
 * @returns 
 */
const getAccountDetailsFromDb = async (email: string, providerUserSid: string, loginProvider: LoginProvider) => {
    const accountDetails = await prisma.users.findMany({
        where: {
            Email: email,
            // ObjectStatus: ObjectStatus.ReadyToUse,

            UserLoginInfos: {
                some: {
                    LoginProvider: loginProvider,
                    ProviderUserId: providerUserSid,
                    ObjectStatus: ObjectStatus.ReadyToUse,
                },
            },
        },
        select: {
            Sid: true,
            AccountName: true,
            Code: true,
            FirstName: true,
            Fullname: true,
            Email: true,
            Phone: true,
            IsActive: true,
            ObjectStatus: true
        },
    });

    if (accountDetails && accountDetails.length > 0) {
        const account = accountDetails[0];

        // get user Roles
        const roles = await prisma.userRoles.findMany({
            where: {
                UserSid: account.Sid,
                ObjectStatus: ObjectStatus.ReadyToUse
            },
            select: {
                RoleType: true
            }
        })

        // get organization
        const branch = await getOrganizationByUserSid(account.Sid);

        return { account, roles, branch }
    }
}

/**
 * load Display name
 */
const loadDisplayName = async (UserSid: string) => {

    const user = await prisma.users.findFirst({
        where: {
            Sid: UserSid
        },
        select: {
            FirstName: true
        }
    })
    if (user && user.FirstName) {
        return user.FirstName;
    } else {
        return "";
    }
}

/**
 * 
 * @param UserSid 
 * @returns 
 */
const getOrganizationByUserSid = async (UserSid: string) => {
    const branch = await prisma.organizationMembers.findFirst({
        where: {
            UserSid: UserSid,
            ObjectStatus: ObjectStatus.ReadyToUse
        },
        select: {
            Organizations: {
                select: {
                    Sid: true,
                    BranchCode: true,
                    BranchName: true,
                    ObjectStatus: true
                }
            }
        }
    });

    if (branch && branch.Organizations && branch.Organizations.ObjectStatus === ObjectStatus.ReadyToUse) {
        return {
            BranchCode: branch.Organizations.BranchCode,
            BranchName: branch.Organizations.BranchName
        };
    }
    return null;
}

// const getBranchByUserSid = async (UserSid: string) => {
//     const branchMember = await prisma.organizationMembers.findFirst({
//         where: {
//             UserSid: UserSid,
//             ObjectStatus: ObjectStatus.ReadyToUse
//         },
//         select: {
//             OrganizationSid: true
//         }
//     })

//     if (branchMember && branchMember.OrganizationSid) {
//         return await prisma.organizations.findFirst({
//             where: {
//                 Sid: branchMember.OrganizationSid,
//                 ObjectStatus: ObjectStatus.ReadyToUse
//             },
//             select: {
//                 BranchCode: true
//             }
//         })
//     }
// }
/**
 * Update display name
 * @param UserSid 
 * @param DisplayName 
 * @returns 
 */
const updateDisplayName = async (UserSid: string, DisplayName: string): Promise<boolean> => {

    const result = await prisma.users.update({
        where: {
            Sid: UserSid
        },
        data: {
            FirstName: DisplayName,
            UpdatedBy: UserSid,
            UpdatedAt: new Date()
        }
    })
    if (result && result.FirstName === DisplayName) {
        return true;
    } else {
        return false
    }
}

/**
 * Functions for retries account from Auth0
 * 
 * Nhận thông tin tài khoản từ Auth0 POST qua Quiz.AI
 * Kiểm tra `email` có hay chưa
 *   - Không => Tạo tài khoản `User`
 */
const createOrUpdateUserAccountRetrieveFromAuth0 = async (newUserSid: string, auth0Data: any, accountActivated: boolean) => {
    try {
        const existingAccount = await prisma.users.findFirst({
            where: {
                Email: auth0Data.email
            },
            select: {
                Sid: true
            }
        })

        if (!existingAccount) { // not existed => do create
            logger.info(`[services.account.account-service.createOrUpdateUserAccountRetrieveFromAuth0] Account NOT existed. Create account: ${JSON.stringify(auth0Data)}`)
            const accountCreated = await createAccountRetrieveFromAuth0(newUserSid, auth0Data, accountActivated)

            if (accountCreated) {
                createUserLoginInfo(newUserSid, auth0Data);
                assignUserRoles(newUserSid);
            }
        } else { // existed => do update
            logger.info(`[services.account.account-service.createOrUpdateUserAccountRetrieveFromAuth0] account existed: account Sid: ${existingAccount.Sid}`)
        }
    }
    catch (err) {
        logger.error(`[services.account.account-service.createOrUpdateUserAccountRetrieveFromAuth0]: ${err}`)
    }

}
const createAccountRetrieveFromAuth0 = async (newUserSid: string, auth0Data: any, accountActivated: boolean) => {
    try {
        let { createdAt, updatedAt } = auth0Data;
        createdAt = createdAt ? new Date(createdAt).toISOString() : new Date().toISOString();
        updatedAt = updatedAt ? new Date(updatedAt).toISOString() : new Date().toISOString();

        return prisma.users.upsert({
            where: {
                Email: auth0Data.email
            },
            create: {
                Sid: newUserSid,
                Email: auth0Data.email,
                Fullname: auth0Data.name || '',
                FirstName: auth0Data.name || '',

                Gender: 0,
                Birthday: new Date(Date.UTC(1970, 0, 1)),

                IsActive: accountActivated,
                IsChangePasswordAtNextLogin: false,
                AccessFailedCount: 0,

                LatestLoginDate: new Date().toISOString(),
                StartDate: new Date().toISOString(),
                EndDate: new Date(Date.UTC(9999, 1, 1)),

                CreatedAt: createdAt,
                UpdatedAt: updatedAt,

                ObjectStatus: ObjectStatus.ReadyToUse
            },
            update: {}
        })
    } catch (err) {
        logger.error(`[services.account.account-service.createOrUpdateAccount]: ${err}`)
    }
}

const createUserLoginInfo = async (newUserSid: string, auth0Data: any) => {
    try {
        //1. check exists
        const countUserLoginInfo = await prisma.userLoginInfos.count({
            where: {
                UserSid: newUserSid,
                LoginProvider: LoginProvider.Auth0,
                ProviderKey: auth0Data.tenantId,
                ProviderUserId: auth0Data.userId,
                ObjectStatus: ObjectStatus.ReadyToUse
            }
        })

        if (countUserLoginInfo <= 0) { // not existed => do create
            await prisma.userLoginInfos.create({

                data: {
                    Sid: crypto.randomUUID(),
                    UserSid: newUserSid,
                    ProviderUserId: auth0Data.userId,
                    LoginProvider: LoginProvider.Auth0,
                    ProviderKey: auth0Data.tenantId,

                    CreatedAt: new Date().toISOString(),
                    UpdatedAt: new Date().toISOString(),

                    ObjectStatus: ObjectStatus.ReadyToUse
                }
            })
        }

    }
    catch (err) { logger.error(`[services.account.account-service.createUserLoginInfo] error: ${JSON.stringify(err)}`) }
}


const assignUserRoles = async (newUserSid: string) => {
    // check exist
    const countUserRoles = await prisma.userRoles.count({
        where: {
            UserSid: newUserSid,
            RoleType: RoleType.StandardMembers,
            ObjectStatus: ObjectStatus.ReadyToUse
        },
    })

    if (countUserRoles <= 0) {
        await prisma.userRoles.create({
            data: {
                Sid: crypto.randomUUID(),
                UserSid: newUserSid,
                RoleType: RoleType.StandardMembers,
                CreatedAt: new Date().toISOString(),
                UpdatedAt: new Date().toISOString(),

                ObjectStatus: ObjectStatus.ReadyToUse
            },
        })
    }
}
/**
 * Exports
 */
export const accountService = {
    getAccountDetails, updateDisplayName, createOrUpdateUserAccountRetrieveFromAuth0, createUserLoginInfo, assignUserRoles, updateProfile, getAccountDetailsFromDb, getUserDetailsByEmailLoginProvider, isGoogleAccountLinked
}