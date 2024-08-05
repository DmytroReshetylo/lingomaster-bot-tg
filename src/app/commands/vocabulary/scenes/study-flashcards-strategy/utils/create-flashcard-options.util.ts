import { Flashcard } from '../../../../../services/database/vocabulary/types';
import { random } from '../../../../../shared/utils';

export function CreateFlashcardOptions(
    rightFlashcard: Flashcard,
    flashcards: Flashcard[],
    backSide: 'word' | 'translate'
) {
    return Array(4).fill(1).reduce((acc: string[]) => {
        for(let index = random(0, flashcards.length - 1); true; index = random(0, flashcards.length - 1)) {
            if(!acc.includes(flashcards[index][backSide])) {
                return random(0, 1) ? [...acc, flashcards[index][backSide]] : [flashcards[index][backSide], ...acc];
            }
        }
    }, [rightFlashcard[backSide]]);
}