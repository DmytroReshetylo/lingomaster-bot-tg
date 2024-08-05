import { Flashcard } from '../../../../../../services/database/vocabulary/types';
import { ShowFlashcardFormat } from './show-flashcard-format.type';

export type ShowFlashcardFormatFunc = (
    data: {
        index: number,
        rightFlashcard: Flashcard ,
        showSide: 'word' | 'translate',
        flashcards?: Flashcard[]
    }
) => ShowFlashcardFormat