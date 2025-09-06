/**
 * Quiz: Server Action
 */
'use server';

import { getUserQuizHistoryListByUserSid, quizService } from "@/services/quiz/quiz-service";
import { UserQAHistory } from "@/types/api-mappings";
import { cryptorUtils } from "@/utils/cryptor/cryptor";
import { logger } from "@/utils/logger";



export async function getQuizList(page: number = 1, pageSize: number = 10) {
    return quizService.getQuizList({ page, pageSize });
}

export async function getQAs(userSid: string, quizCode: string, sk: number, tk: number): Promise<any> {
    if (!quizCode || !userSid) {

        logger.error(`[actions.quiz-action => getQAs]: Invalid param: quizCode: [${quizCode}] userSid: [${userSid}]`)
        return null
    }

    const originalData = await quizService.getQAsByQuizCode(quizCode, sk, tk); // return { QAList: qAList, QuestionsCount: questionsCount };

    return await cryptorUtils.encryptString(JSON.stringify(originalData))
}



/**
 * 
 * @param userSid 
 * @param quizCode 
 * @returns 
 */
// const getUserQAsHistories = async (userSid: string, quizCode: string) => {
async function getQuizDetailsAndUserQAsHistories(userSid: string, quizCode: string): Promise<any | null> {
    const quizDetails = await quizService.getQuizDetailsByCode(quizCode);
    if (!quizDetails || !quizDetails.quizTest) return null;

    const userQAsHistories = await quizService.getUserQAHistories(userSid, quizDetails.quizTest.Sid);

    return { quizDetails, userQAsHistories }
}


const saveUserQAHistory = async (userSid: string, quizSid: string, questionSid: string, answerSid: string, isCorrect: boolean, questionSortOrder: number) => {
    try {
        const userQAHistoryReturn = await quizService.setUserQAHistory(userSid, quizSid, questionSid, answerSid, isCorrect, questionSortOrder) as unknown as UserQAHistory;
        if (userQAHistoryReturn) {
            // console.log(userQAHistoryReturn)
            return true
        } else {
            // console.warn('false')
            return false
        }
    }
    catch (error) {
        throw error
    }
}


export const getUserQuizActivityList = async (userSid: string, limit: number = 10) => {
    if (!userSid) return null

    return await getUserQuizHistoryListByUserSid(userSid, limit)
}







