import { FeedbackCategory, FeedbackPriority, FeedbackStatus, ObjectStatus } from "../enums";

/**
 * Feedback API mapping
 */
export interface Feedback {
    sid: string;
    userSid: string | null;
    title: string | null;
    content: string | null;
    category: FeedbackCategory;
    priority: FeedbackPriority;
    status: FeedbackStatus;
    objectStatus: ObjectStatus;
    createdBy: string | null;
    createdAt: Date;
    updatedBy: string | null;
    updatedAt: Date | null;
}

export interface FeedbackComment {
    sid: string
    feedbackSid: string
    userSid: string
    content: string
    parentSid?: string | null
    createdAt?: Date | null
    createdBy: string | null
}

export interface FeedbackDetails {
    sid: string
    title: string
    content: string
    status: number
    category: number
    priority: number
    createdAt: string
    userSid: string
}