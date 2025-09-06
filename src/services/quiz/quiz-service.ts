import { ObjectStatus } from "@/types/enums";
import { prisma } from "@/utils/db";
import { logger } from "@/utils/logger";
import { UserQuizHistoryStatus } from './../../types/enums';
import cache from "@/utils/cache";


/**
 * Lấy tất cả bài Quiz với phân trang
 */
const getQuizList = async ({ page = 1, pageSize = 10 }) => {
    const skip = (page - 1) * pageSize;

    const [total, items] = await Promise.all([
        // Get total count
        prisma.quizTests.count({
            where: {
                ObjectStatus: ObjectStatus.ReadyToUse,
                IsPublic: true
            }
        }),
        // Get paginated items
        prisma.quizTests.findMany({
            skip,
            take: pageSize,
            where: {
                ObjectStatus: ObjectStatus.ReadyToUse,
                IsPublic: true
            },
            select: {
                Code: true,
                Name: true,
                Description: true,
                ThumbnailUri: true,
                SearchTerm: true, // temporary use as Category �
                CreatedAt: true,
                UpdatedAt: true,
                ObjectStatus: true
            },
            orderBy: {
                UpdatedAt: 'desc',
            }
        })
    ]);

    return {
        items,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
    };
}

/**
 * Lấy bài Quiz theo Code truyền vào
 * @param quizCode 
 * @returns 
 */
export const getQuizTestByCode = async (quizCode: string) => {
    if (!quizCode)
        return null

    // check cache first
    const cachedQuiz = await cache.get(`quiz_info_${quizCode}`)
    if (cachedQuiz) return JSON.parse(cachedQuiz)

    // quiz info
    let quizInfo = await prisma.quizTests.findFirst({
        where: {
            Code: quizCode,
            ObjectStatus: ObjectStatus.ReadyToUse,
        },
        select: {
            Sid: true,
            Code: true,
            Name: true,
            Description: true,
            ThumbnailUri: true,
            SearchTerm: true, // temporary use as Category 🤣
            CreatedAt: true,
            CreatedBy: true,
            IsPublic: true,
            Password: true
        }
    })

    if (!quizInfo) return null
    // cache quiz info
    await cache.set(`quiz_info_${quizCode}`, JSON.stringify({ ...quizInfo, IsProtected: quizInfo?.Password ? true : false, Password: null }), 60 * 60 * 24); // 24 hours
    return { ...quizInfo, IsProtected: quizInfo?.Password ? true : false, Password: null }
}
/**
 * Lấy bài Quiz theo Sid
 * @param quizSid 
 * @returns 
 */
const getQuizTestBySid = async (quizSid: string) => {
    if (!quizSid)
        return null

    // quiz info
    return await prisma.quizTests.findFirst({
        where: {
            Sid: quizSid,
            ObjectStatus: ObjectStatus.ReadyToUse,
        },
        select: {
            Sid: true,
            Code: true,
            Name: true,
            Description: true,
            ThumbnailUri: true,
            SearchTerm: true, // temporary use as Category 🤣
            CreatedAt: true,
            CreatedBy: true,
            IsPublic: true,
        }
    })
}

/**
 * count questions in quiz
 * @param quizCode 
 * @returns 
 */
const countQuestionsInQuiz = async (quizSid: string) => {
    if (!quizSid) return 0

    return await prisma.quizQuestions.count({
        where: {
            QuizSid: quizSid,
            ObjectStatus: ObjectStatus.ReadyToUse,
        }
    })
}

const getQuizDetailsByCode = async (quizCode: string) => {
    if (!quizCode) return null

    const quizTest = await getQuizTestByCode(quizCode) // return { ...quizInfo, IsProtected , Password: null } || null

    if (!quizTest) return null

    const questionsCount = await countQuestionsInQuiz(quizTest?.Sid!)

    return {
        quizTest,
        questionsCount
    }
}

/**
 * Get all questions in QuizQuestions by quiz Sid
 * @param QuizSid 
 * @returns QuestionSids[]
 */
export const getAllQuestionSidsInQuiz = async (QuizSid: string) => {
    const questionSids = await prisma.quizQuestions.findMany({
        where: {
            QuizSid,
            ObjectStatus: ObjectStatus.ReadyToUse,
        },
        select: {
            QuestionSid: true,
        },
        orderBy:
            { SortOrder: 'asc' }

    })
    return questionSids;
}
const getQuestionSidsInQuizByQuizSid = async (Sid: string, skip: number, take: number) => {
    const questions = await prisma.quizQuestions.findMany({
        skip,
        take,
        where: {
            QuizSid: Sid,
            ObjectStatus: ObjectStatus.ReadyToUse,
        },
        select: {
            QuestionSid: true,
            SortOrder: true
        },
        orderBy:
            // [{ CreatedAt: 'asc' },{ Sid: 'asc' }]
            { SortOrder: 'asc' }

    })
    console.log(questions)
    return questions;
}

const getQuestionBySid = async (Sid: string) => {
    const question = await prisma.questions.findFirst({
        where: {
            Sid: Sid,
            ObjectStatus: ObjectStatus.ReadyToUse,
        },
        select: {
            Sid: true,
            Content: true,
            Source: true,
        }
    })

    return question;
}

const getAnswersByQuestionSid = async (Sid: string) => {
    const answers = await prisma.answers.findMany({
        where: {
            QuestionSid: Sid,
            ObjectStatus: ObjectStatus.ReadyToUse,
        },
        select: {
            Sid: true,
            Content: true,
            IsCorrect: true,
        },
        orderBy: {
            DisplayOrder: 'asc'
        }
    })

    return answers;
}
/**
 * 
 * @param quizCode 
 * @param skip 
 * @param take 
 * @returns 
 */
const getQAsByQuizCode = async (quizCode: string, skip: number, take: number) => {
    const quiz = await getQuizTestByCode(quizCode);

    if (!quiz) return { QAList: null, QuestionsCount: null };;

    logger.info(`[api.quiz.getQAsByQuizCode] => [${quiz.Code}] => [${quiz.Name}]`)
    const quizSid = quiz.Sid;

    // questions in quiz (by quizCode)
    const quizQuestions = await getQuestionSidsInQuizByQuizSid(quizSid, skip, take);
    const questionsCount = await countQuestionsInQuiz(quizSid);

    if (!quizQuestions) return null

    logger.info(`[api.quiz.getQAsByQuizCode] => [${quiz.Code}] => [${quiz.Name}] => [${questionsCount}] questions in quiz`)

    const qAList = [];
    for (const quizQuestion of quizQuestions) {
        const questionSid = quizQuestion.QuestionSid;

        if (!questionSid) continue

        const question = await getQuestionBySid(questionSid);

        if (question) {
            const answers = await getAnswersByQuestionSid(questionSid);

            if (answers && answers.length > 0) {
                const qa = {
                    SortOrder: quizQuestion.SortOrder,
                    Question: question,
                    Answers: answers
                };
                qAList.push(qa);
            }
        }
    } // end for


    return { QAList: qAList, QuestionsCount: questionsCount };
}

/*------------------------------------------
                Practice Mode
------------------------------------------*/
export const saveUserPracticeHistory = async (UserSid: string, QuizSid: string) => {
    return await prisma.userQuizHistories.create({
        data: {
            Sid: crypto.randomUUID(),
            UserSid, QuizSid,
            UserQuizHistoryStatus: UserQuizHistoryStatus.Doing,

            BeginAt: new Date(),

            ObjectStatus: ObjectStatus.ReadyToUse,
            CreatedBy: UserSid,
            CreatedAt: new Date(),
            UpdatedBy: UserSid,
            UpdatedAt: new Date(),
        }
    })

}
/**
 * Hàm khởi tạo UserStartNewQuiz (mới)
 * Ghi log user tham gia Quiz theo `AttemptCount` (số lần)
 * Tạo sẵn slot QA cho bảng `UserQAHistories`
 * @param UserSid 
 * @param QuizSid 
 * @param LatestAttemptCount 
 */
const setUserStartNewQuiz = async (UserSid: string, QuizSid: string, LatestAttemptCount: number) => {
    // set user login in UserQuizHistory following AttemptCount
    return await prisma.userQuizHistories.create({
        data: {
            Sid: crypto.randomUUID(),
            UserSid,
            QuizSid,
            UserQuizHistoryStatus: UserQuizHistoryStatus.Doing,
            AttemptCount: LatestAttemptCount,

            BeginAt: new Date(),

            ObjectStatus: ObjectStatus.ReadyToUse,

            CreatedBy: UserSid,
            CreatedAt: new Date(),
            UpdatedBy: UserSid,
            UpdatedAt: new Date(),
        }
    })
}


/**
 * Ghi log User tham gia a Quiz
 * @param UserSid 
 * @param QuizSid 
 */
const setUserQuizHistory = async (UserSid: string, QuizSid: string, AttemptCount: number) => {
    // return await prisma.userQuizHistories.upsert({
    //     where: {
    //         UserSid_QuizSid: {
    //             UserSid, QuizSid
    //         },
    //         ObjectStatus: ObjectStatus.ReadyToUse,
    //     },
    //     create: {
    //         Sid: crypto.randomUUID(),
    //         UserSid,
    //         QuizSid,
    //         AttemptCount,

    //         UserQuizHistoryStatus: UserQuizHistoryStatus.Doing,

    //         BeginAt: new Date(),

    //         ObjectStatus: ObjectStatus.ReadyToUse,

    //         CreatedBy: UserSid,
    //         CreatedAt: new Date(),
    //         UpdatedBy: UserSid,
    //         UpdatedAt: new Date(),
    //     },
    //     update: {}
    // })
}

/**
 * set User stop/cancel a Quiz
 * @param UserSid 
 * @param QuizSid 
 * @returns 
 */
// const setUserStopQuizHistory = async (UserSid: string, QuizSid: string, AttemptCount: number) => {
//     return await prisma.userQuizHistories.update({
//         where: {
//             UserSid_QuizSid: {
//                 UserSid, QuizSid
//             },
//             AttemptCount,
//             ObjectStatus: ObjectStatus.ReadyToUse,
//         },
//         data: {
//             UserQuizHistoryStatus: UserQuizHistoryStatus.Cancelled,
//             EndAt: new Date(),
//             UpdatedBy: UserSid,
//             UpdatedAt: new Date(),
//         }
//     })
// }

/**
 * User kết thúc (finish/end) a Quiz
 * @param UserSid 
 * @param QuizSid 
 * @returns 
 */
// const setUserFinishQuizHistory = async (UserSid: string, QuizSid: string, AttemptCount: number) => {
//     return await prisma.userQuizHistories.update({
//         where: {
//             UserSid_QuizSid: {
//                 UserSid, QuizSid
//             },
//             AttemptCount,
//             ObjectStatus: ObjectStatus.ReadyToUse,
//         },
//         data: {
//             UserQuizHistoryStatus: UserQuizHistoryStatus.Finished,

//             EndAt: new Date(),
//             UpdatedBy: UserSid,
//             UpdatedAt: new Date(),
//         }
//     })
// }
/**
 * Tạo sẵn history QA trong bản UserQAHistories tương ứng với số câu hỏi trong bài QuizTest
 * @param UserSid 
 * @param QuizSid 
 */
const createPlaceholderUserQAsHistories = async (UserSid: string, QuizSid: string) => {
    // const questionsCount = await countQuestionsInQuiz(QuizSid)

    // const questionSids = await getAllQuestionSids(QuizSid); // list questions Sid
    // if (!questionSids || questionSids.length <= 0) return

    // questionSids.forEach(async (questionSid) => {
    //     if (questionSid) { await setUserQAHistory(UserSid, QuizSid, questionSid.toString(), '') }

    // })
}
/**
 * Ghi log User trả lời đáp án trong câu hỏi trong bài Quiz
 * @param UserSid 
 * @param QuizSid 
 * @param QuestionSid 
 * @param AnswerSid 
 */
export const setUserQAHistory = async (UserSid: string, QuizSid: string, QuestionSid: string, AnswerSid: string, IsCorrect: boolean, questionSortOrder: number) => {
    const qaExists = await prisma.userQAHistories.findFirst({
        where: {
            UserSid, QuizSid, QuestionSid,
            ObjectStatus: ObjectStatus.ReadyToUse,
        },
        orderBy: { CreatedAt: 'desc' },
    })

    if (qaExists) {
        // update new value
        await prisma.userQAHistories.update({
            where: {
                Sid: qaExists.Sid,
                // UserSid, QuizSid, QuestionSid, AnswerSid, ObjectStatus: ObjectStatus.ReadyToUse,
            },
            data: {
                AnswerSid,
                IsCorrect,

                UpdatedAt: new Date(),
                UpdatedBy: UserSid,
            }
        })
        // return null
    } else {
        // insert new value
        return await prisma.userQAHistories.create({
            data: {
                Sid: crypto.randomUUID(),
                UserSid, QuizSid, QuestionSid, AnswerSid,
                IsCorrect,
                QuestionSortOrder: questionSortOrder,

                ObjectStatus: ObjectStatus.ReadyToUse,

                CreatedBy: UserSid,
                CreatedAt: new Date(),
                UpdatedBy: UserSid,
                UpdatedAt: new Date(),
            }
        })
    }
    /**
     * user upsert  
     */
    // await prisma.userQAHistories.upsert({
    //     where: {
    //         UserSid_QuizSid_QuestionSid: {
    //             UserSid, QuizSid, QuestionSid
    //         },
    //         ObjectStatus: ObjectStatus.ReadyToUse,
    //     },
    //     create: {
    //         Sid: crypto.randomUUID(),
    //         UserSid, QuizSid, QuestionSid, AnswerSid,
    //         ObjectStatus: ObjectStatus.ReadyToUse,
    //         CreatedBy: UserSid,
    //         CreatedAt: new Date(),
    //         UpdatedBy: UserSid,
    //         UpdatedAt: new Date(),
    //     },
    //     update: {
    //         // UserSid, QuizSid, QuestionSid, 
    //         AnswerSid,
    //         UpdatedAt: new Date(),
    //         UpdatedBy: UserSid,
    //         ObjectStatus: ObjectStatus.ReadyToUse,
    //     }
    // })
}
/**
 * 
 * @param UserSid 
 * @param QuizSid 
 * @returns 
 */
export const getUserQAHistories = async (UserSid: string, QuizSid: string, orderByDesc: boolean = false) => {
    return await prisma.userQAHistories.findMany({
        where: {
            UserSid, QuizSid,
            ObjectStatus: ObjectStatus.ReadyToUse,
        },
        orderBy: {
            CreatedAt: orderByDesc ? 'desc' : 'asc'
        },
        select: {
            UserSid: true,
            QuizSid: true,
            QuestionSid: true,
            QuestionSortOrder: true,
            AnswerSid: true,
            AttemptCount: true,

            CreatedAt: true,
            UpdatedAt: true,
        }
    })
}
/**
 * 
 * @param UserSid 
 * @param QuizSid 
 * @returns 
 */
const countUserQAHistories = async (UserSid: string, QuizSid: string) => {
    return await prisma.userQAHistories.count({
        where: {
            UserSid, QuizSid,
            ObjectStatus: ObjectStatus.ReadyToUse,
        },
    })
}
/**
 * 
 * @param UserSid 
 * @param QuizSid 
 * @returns 
 */
export const countUserQAHistoriesByQuizHistorySid = async (UserSid: string, QuizHistorySid: string) => {
    const total = await prisma.userQAHistories.count({
        where: {
            UserSid, QuizHistorySid,
            ObjectStatus: ObjectStatus.ReadyToUse,
        },
    })

    const remaining = await prisma.userQAHistories.count({
        where: {
            UserSid, QuizHistorySid,
            OR: [
                { IsCorrect: false },
                { IsCorrect: null },
            ],
            ObjectStatus: ObjectStatus.ReadyToUse,
        },
    })

    return { total, remaining }
}
/**
 * 
 * @param UserSid 
 * @param QuizSid 
 * @returns 
 */
const getUserQuizHistory = async (UserSid: string, QuizSid: string) => {
    return await prisma.userQuizHistories.findFirst({
        where: {
            UserSid, QuizSid,
            ObjectStatus: ObjectStatus.ReadyToUse,
        },
        select: {
            UserSid: true,
            QuizSid: true,
            AttemptCount: true,
            UserQuizHistoryStatus: true,

            BeginAt: true,
            EndAt: true,
            CreatedAt: true,
            UpdatedAt: true,
        }
    })
}

/**
 * Get all user quiz history
 * @param UserSid 
 */
export const getAllUserQuizHistories = async (UserSid: string) => {
    return await prisma.userQuizHistories.findMany({
        where: {
            UserSid,
            ObjectStatus: ObjectStatus.ReadyToUse,
        },
        select: {
            UserSid: true,
            QuizSid: true,
            UserQuizHistoryStatus: true,
            BeginAt: true,
            EndAt: true,
        },
        orderBy: {
            CreatedAt: 'desc'
        }
    })
}
/**
 * 
 * @param UserSid 
 * @param QuizSid 
 * @returns 
 */
export const getUserQuizHistories = async (UserSid: string, QuizSid: string) => {
    return await prisma.userQuizHistories.findMany({
        where: {
            UserSid, QuizSid,
            ObjectStatus: ObjectStatus.ReadyToUse,
        },
        select: {
            Sid: true,
            UserSid: true,
            QuizSid: true,
            UserQuizHistoryStatus: true,
            AttemptCount: true,

            BeginAt: true,
            EndAt: true,
            CreatedAt: true,
            UpdatedAt: true,
        },
        orderBy: {
            CreatedAt: 'desc'
        }
    })
}
/**
 * Count user quiz history by status
 * @param UserSid 
 * @param QuizSid 
 * @param UserQuizHistoryStatus 
 * @returns 
 */
export const countUserQuizHistoriesByStatus = async (UserSid: string, QuizSid: string, UserQuizHistoryStatus: UserQuizHistoryStatus) => {
    return await prisma.userQuizHistories.count({
        where: {
            UserSid, QuizSid,
            UserQuizHistoryStatus,

            ObjectStatus: ObjectStatus.ReadyToUse,
        },
    })
}

// get max attempt count in UserQuizHistories
const getMaxAttemptCount = async (UserSid: string, QuizSid: string) => {

    const userQuizHistory = await prisma.userQuizHistories.findFirst({
        where: {
            UserSid, QuizSid,
            ObjectStatus: ObjectStatus.ReadyToUse,
        },
        orderBy: {
            AttemptCount: 'desc'
        },
        select: {
            AttemptCount: true
        }
    });
    const maxAttemptCount = userQuizHistory?.AttemptCount ?? 0;
    return maxAttemptCount;
}

/**-------------------------------------------------
 *      Statistics
 -------------------------------------------------*/
const getJoinedUsersInQuiz = async (quizCode: string) => {
    return await prisma.userQuizHistories.findMany({
        distinct: ['UserSid'],
        where: {
            QuizTests: {
                Code: quizCode,
            }

        },
        select: {
            Users: {
                select: {
                    FirstName: true,
                    AvatarUrl: true,
                }
            }
        },
    });

}

const countJoinedUsersInQuiz = async (quizCode: string): Promise<number> => {
    return await prisma.userQuizHistories.count({
        where: {
            QuizTests: {
                Code: quizCode,
                ObjectStatus: ObjectStatus.ReadyToUse,
            },
            ObjectStatus: ObjectStatus.ReadyToUse,
        },
    });
}

/**
 * My quiz activities
 */
export const getUserQuizHistoryListByUserSid = async (UserSid: string, limit: number) => {
    return await prisma.userQuizHistories.findMany({
        take: limit,
        where: {
            UserSid,
            UserQuizHistoryStatus: UserQuizHistoryStatus.Doing,
            ObjectStatus: ObjectStatus.ReadyToUse,
        },
        orderBy: {
            CreatedAt: 'desc'
        },
        select: {
            UserQuizHistoryStatus: true,
            CreatedAt: true,
            // relationship
            QuizTests: {
                select: {
                    Code: true,
                    Name: true,
                    Description: true,
                }
            }
        },
    });
}

/**
 * exports
 */
export const quizService = { countUserQAHistories, getQAsByQuizCode, getQuizDetailsByCode, getQuizList, getUserQAHistories, getUserQuizHistory, setUserQAHistory, getJoinedUsersInQuiz, getUserQuizHistories, countUserQuizHistoriesByStatus, getQuizTestByCode, getMaxAttemptCount, setUserStartNewQuiz, countJoinedUsersInQuiz };

