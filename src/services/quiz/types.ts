import { ObjectStatus, UserQuizHistoryStatus } from "@/types/enums";

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
	Source: string;
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