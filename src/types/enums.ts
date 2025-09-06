export enum ObjectStatus {
    /// <summary>
    /// Nháp
    /// </summary>
    Drafted = 0,

    /// <summary>
    /// Sẵn sàng hoạt động
    /// </summary>
    ReadyToUse = 1,

    /// <summary>
    /// Backup
    /// </summary>
    Backup = 2,

    /// <summary>
    /// Rác hệ thống
    /// </summary>
    Obsoleted = 3,
}

export enum RoleType {
    Unknown = 0,
    StandardMembers = 1,
    AdvancedMembers = 2,
    PremiumMembers = 5,
    Moderators = 7,
    SuperModerators = 8,
    AppAdministrators = 9,
    HostAdministrators = 10,
}

export enum OrganizationType {
    Branch = 1,
    ApprovalCenter = 2,
    HeadOfficeDepartment = 3,
    HeadOffice = 4
}

export enum BackgroundJobStatus {
    Pending = 0,
    Running = 1,
    Stopped = 2,
    Cancelled = 3,
    Failed = 4,
    Completed = 9
}

export enum AI {
    // OpenAI
    OpenAI_ChatGPT_3_5 = 1,
    OpenAI_ChatGPT_3_5_Turbo = 2,
    OpenAI_ChatGPT_4 = 3,
    OpenAI_ChatGPT_4_Turbo = 4,

    // Alphabet Google
    Google_Gemini = 10,

    // Microsoft
    Microsoft_Copilot = 20,

    // Facebook Meta
    Meta_Llama2 = 30,

    // Hugging Face

    // Ollama
    Ollama_Ollama = 80,
    // Others
    Other = 500,
}

export enum UserQuizHistoryStatus {
    None = 0,
    Doing = 1,
    Cancelled = 2,
    Finished = 3
}

export enum LoginProvider {
    Auth0 = 1,
    Google = 2,
    Facebook = 3,
    Microsoft = 4,
    Apple = 5,
    OpenIDConnect = 6,
    OAuth2 = 7,

    GitHub = 8,
    Twitter = 9,
    Ldap = 10,
}

/**
 * Feedbacks
 */
export enum FeedbackStatus {
    Pending = 0,
    Approved = 1,
    Rejected = 2,
    Cancelled = 3,
    Completed = 4,
}
export enum FeedbackCategory {
    Bug = 0,
    Feature = 1,
    Suggestion = 2,
    Other = 3,
}
export enum FeedbackPriority {
    Low = 0,
    Medium = 1,
    High = 2,
    Urgent = 3,
}


/**
 * 
 * @param enumObj 
 * @param value 
 * @returns 
 */

export function getEnumText<T>(enumObj: { [key: string]: T }, value: T): string {
    const enumKey = Object.keys(enumObj).find(key => enumObj[key] === value);
    return enumKey ? enumKey : 'Unknown';
}