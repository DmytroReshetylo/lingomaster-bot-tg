import { Flashcard } from '../../../../../../services/database/vocabulary/types';
import { ShowFlashcardFormat } from '../types';

export function ShowFlashcardFormatWithoutPhotoAndOptions(
    data: {
        index: number,
        rightFlashcard: Flashcard,
        showSide: 'word' | 'translate'
    }
): ShowFlashcardFormat {
    return {
        index: data.index,
        frontSide: data.rightFlashcard[data.showSide],
        backSide: data.rightFlashcard[data.showSide === 'word' ? 'translate' : 'word']
    }
}