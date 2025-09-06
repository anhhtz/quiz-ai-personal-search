export interface DocumentLoadResult {
	AnalyzeResult: AnalyzedResult,
	InsertedResult: InsertedResult

}
export interface AnalyzedResult {
	Data: string[],
	Total: number
}

export interface InsertedResult {

	Total: number
}

export interface DocumentResponse {
	Sid: string
	ShortTerms: string
	Terms: string
	Content: string
}

export interface QaResponse {
	Sid: string,
	Question: string,
	Answer1: string,
	Answer2: string,
	Answer3: string
	Answer4?: string,
	Correct: string,
	Source: string,
}

export interface Question {
	Sid: string, Content: string, Status: number,
}

export interface Answer {
	Sid: string,
	QuestionSid: string,
	Content: string
}

export interface QA {
	Question: Question
	Answers: Answer
}

export interface Quiz {
	Sid: string,
	Name: string,
	Description: string
	Questions: Question[],
}

export interface UserQuizResult {
	Sid: string,
	QuizSid: string,
	UserId: string
}