import { ObjectStatus, UserQuizHistoryStatus } from "./enums";
import { MetaKey } from "./user-metadata";


/**
 * JSend response format for API
 * https://labs.jxck.io/jsend
 * @see https://labs.jxck.io/jsend
 * @param status
 * @param message
 * @param data
 */
export interface jSend {
    status: string;
    message: string;
    data?: any;
}


export interface QuizTest {
    Sid: string;
    Code: string;
    Name: string;
    Description: string;
    QuizCategorySid?: string;
    IsPublic: boolean;
    ThumbnailUri?: string;
    SearchTerm?: string; // temporary use as Category 🤣
    Tags?: string;
    BeginAt?: Date;
    EndAt?: Date;
    CreatedAt: Date;
    CreatedBy: string;
    ObjectStatus: ObjectStatus;
    IsProtected?: boolean;
    // Password?: string;
}
/**
 * QuizDetails
 */
export interface QuizDetails {
    quizTest: QuizTest,
    questionsCount: number
}
/**
 * UserQuizDetails
 * Contains information of user join quiz and activity of quiz
 */
export interface UserQuizDetails {
    quizDetails: QuizDetails,
    userQuizHistory: UserQuizHistory;
    userQAHistoriesCount: number;
}
/**
 * UserQuizInformation
 */
export interface UserQuizInformation {
    quizDetails: QuizDetails,
    userQuizHistories: UserQuizHistory[];
    // userQAHistoriesCount: number;
}


export interface Question {
    Sid: string;
    Content: string;
    CreatedAt: Date;
    CreatedBy: string;
    CreatedByFullName?: string;
    Answers: Answer[];
    Category: string; // temporary use as Category 🤣
}

export interface QuizQuestion {
    Sid: string;
    QuizSid: string;
    QuestionSid: string;
}
export interface Answer {
    Sid: string;
    Content: string;
    IsCorrect: boolean;
}

export interface QA {
    Question: Question;
    Answers: Answer[];
}
export interface UserQAHistory {
    Sid: string;
    UserSid: string;
    QuizSid: string;
    QuestionSid: string;
    AnswerSid: string;
    IsCorrect: boolean;
    QuestionSortOrder: number;

    CreatedAt: Date;
    UpdatedAt: Date;
}

export interface UserQAResponse {
    QuestionsCount: number,
    QAList: QA[],
    UserQAHistories: UserQAHistory[]
}

export interface UserQuizHistory {
    Sid: string;
    UserSid: string;
    QuizSid: string;
    UserQuizHistoryStatus: UserQuizHistoryStatus;

    BeginAt: Date;
    EndAt: Date;

    AttemptCount: number; // số lần tham gia

    CreatedAt: Date;
    UpdatedAt: Date;

    // add more field here
    TotalQA?: number;
    RemainingQA?: number;
}




export interface AccountDetails {
    Account: Account;
    Roles: Role[];
    Branch: Branch;
}
export interface AccountDataResponse {
    account: Account;
    roles: Role[];
    branch: Branch;
}

export interface Account {
    Sid: string;
    FirstName: string;
    Fullname: string;
    Code: string;
    Email: string;
    AccountName: string;
    Phone: string;
    IsActive: boolean;
    ObjectStatus: ObjectStatus;
}

export interface Role {
    RoleType: string,
}

export interface Branch {
    Sid: string;
    BranchCode: string;
    BranchName: string;
    ObjectStatus: ObjectStatus;
}
export interface QuizHistory {
    Sid: string;
    QuizTestRefSid: string;
    UserRefSid: string;

    AttemptCount: number;
    // Status: number;
    BeginAt: string;
    EndAt: string;

    QuizTests: {
        Name: string;
        Description: string;
        TotalQuestions: number;
    };
}

export interface User {
    AccountName: unknown;
    Gender: number;
    Birthday: string | number | Date;
    OrganizationMembers: any;
    AvatarUrl: string | null | undefined;
    Sid: string;
    Code: string;
    Fullname: string;
    FirstName: string;
    Email: string;
    Phone: string;
    IsActive: boolean;
    CreatedOn: Date;
    LatestLoginDate: Date;
}
export interface UserDetails {
    Sid: string;
    AccountName: unknown;
    Code: string | null;
    Fullname: string | null;
    FirstName: string | null;
    Email: string | null;
    Phone: string | null;
    Gender: number;
    Birthday: string | number | Date;
    AvatarUrl: string | null | undefined;
    IsActive: boolean;
    CreatedOn: Date;
    LatestLoginDate: Date;
    OrganizationMembers: Array<{
        Organizations: {
            BranchName: string;
            BranchCode: string;
        };
        Divisions: {
            Name: string;
            Code: string;
        };
        Positions: {
            Name: string;
            Code: string;
        };
    }>;
    UserRoles: Array<{
        Sid: string;
        RoleType: number;
    }>;
}
export interface UserAvatar {
    Sid: string;
    UserSid: string;
    FileName: string;
    FileSize: number;
    FileType: string;
    BucketPath: string;
    PublicUrl: string | null;
    ObjectStatus: number;
    CreatedBy?: string | null;
    CreatedAt?: Date | null;
    UpdatedBy?: string | null;
    UpdatedAt?: Date | null;
}

export interface MetaData {
    key: MetaKey;
    value: string;
}

export interface UserMetaData {
    Sid?: string;
    UserSid: string;
    Key: MetaKey;
    Value: string;
    Group?: string;
    IsActive: boolean;
    StartDate?: Date;
    EndDate?: Date;
}

export interface Organization {
    Sid: string;
    BranchCode?: string;
    BranchName?: string;
    OrganizationType: number;
    ParentSid?: string;
    ObjectStatus: number;
    CreatedBy?: string;
    CreatedAt: Date;
    UpdatedBy?: string;
    UpdatedAt: Date;
    LdapOUCode?: string;
    LdapOUName?: string;
    LdapOUDescription?: string;
    // OrganizationDivisions: OrganizationDivision[];
    // OrganizationMembers: OrganizationMember[];
    Organization?: Organization;
    OtherOrganizations: Organization[];
}