
import { UserQuizInformation } from '@/types/api-mappings';
import { create } from 'zustand';

// interface UserQuizDetailsState {
//     userQuizDetails: UserQuizDetails | null;
//     updateUserQuizDetails: (value: UserQuizDetails) => void;
// }

// /**
//  * useQuizStore
//  */
// export const useQuizStore = create<UserQuizDetailsState>()((set) => ({
//     userQuizDetails: null,
//     updateUserQuizDetails: (value: UserQuizDetails) => set({ userQuizDetails: value }),
// }));

/**
 * User Quiz information
 */
interface UserQuizInformationState {
    userQuizInformation: UserQuizInformation | null;
    updateUserQuizInformation: (value: UserQuizInformation) => void;
}

/**
 * useQuizStore
 */
export const useQuizStore = create<UserQuizInformationState>()((set) => ({
    userQuizInformation: null,
    updateUserQuizInformation: (value: UserQuizInformation) => set({ userQuizInformation: value }),
}));

