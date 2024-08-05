import { Flashcard } from '../../../../../../services/database/vocabulary/types';
import { CreateFlashcardOptions } from '../create-flashcard-options.util';
import { ShowFlashcardFormat } from '../types';

export function ShowFlashcardFormatWithPhotoAndOptions(
    data: {
        index: number
        rightFlashcard: Flashcard,
        flashcards: Flashcard[],
        showSide: 'word' | 'translate',
    }
): ShowFlashcardFormat {
    return {
        index: data.index,
        frontSide: data.rightFlashcard[data.showSide],
        backSide: data.rightFlashcard[data.showSide === 'word' ? 'translate' : 'word'],
        answerOptions: CreateFlashcardOptions(data.rightFlashcard, data.flashcards, data.showSide === 'word' ? 'translate' : 'word'),
        photo: data.rightFlashcard.photoUrl
    }
}