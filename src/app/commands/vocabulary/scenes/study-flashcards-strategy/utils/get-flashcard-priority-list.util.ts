import { Flashcard } from '../../../../../services/database/vocabulary/types';
import { random } from '../../../../../shared/utils';

export function GetFlashcardPriorityList(): ((flashcards: Flashcard[], queueFlashcards: number[], queueFailedFlashcards: number[]) => Flashcard | null)[] {
    return [
        (flashcards: Flashcard[], queueFlashcards: number[], queueFailedFlashcards: number[]) => {
            if(queueFailedFlashcards.length < 5) {
                return null;
            }

            const index = queueFailedFlashcards
            .filter(i => flashcards[i].progress > 5)
            .find(i => random(0, 1));

            if(!index) {
                return null;
            }

            if(queueFailedFlashcards.length - index > 4) {
                return flashcards[index];
            }

            return null;
        },
        (flashcards: Flashcard[], queueFlashcards: number[], queueFailedFlashcards: number[]) => {
            if(queueFailedFlashcards.length < 5) {
                return null;
            }

            let index = random(0, queueFailedFlashcards.length);

            for(; queueFailedFlashcards.length - index <= 4; index = random(0, queueFailedFlashcards.length)) {}

            return flashcards[index];
        },
        (flashcards: Flashcard[], queueFlashcards: number[], queueFailedFlashcards: number[]) => {
            if(queueFlashcards.length) {
                return null;
            }

            const index = queueFailedFlashcards
            .filter(i => flashcards[i].progress <= 5)
            .find(i => random(0, 1));

            if(!index) {
                return null;
            }

            return flashcards[index];
        },
        (flashcards: Flashcard[], queueFlashcards: number[], queueFailedFlashcards: number[]) => {
            if(!queueFlashcards.length) {
                return null;
            }

            return flashcards[queueFlashcards[random(0, queueFlashcards.length - 1)]];
        },
        (flashcards: Flashcard[], queueFlashcards: number[], queueFailedFlashcards: number[]) => {
            if(!queueFailedFlashcards.length) {
                return null;
            }

            return flashcards[queueFailedFlashcards[random(0, queueFailedFlashcards.length - 1)]];
        }
    ]
}