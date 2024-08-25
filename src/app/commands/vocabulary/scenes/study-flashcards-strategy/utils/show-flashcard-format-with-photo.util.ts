import { Flashcard } from '../../../../../services/database/vocabulary/types';
import { RequiredParamsForTransform, ShowTestDataFormat } from '../../../../../testing-alghoritm/word-formats/types';

export function ShowFlashcardFormatWithPhoto(
    data: RequiredParamsForTransform<Flashcard>
): ShowTestDataFormat{
    return {
        frontSide: data.rightData[data.showSide],
        backSide: data.rightData[data.showSide === 'word' ? 'translate' : 'word'],
        photo: data.rightData.photoUrl
    }
}