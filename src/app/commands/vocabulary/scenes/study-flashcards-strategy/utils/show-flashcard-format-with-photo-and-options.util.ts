import { Flashcard } from '../../../../../services/database/vocabulary/types';
import { CreateTestDataOptions } from '../../../../../testing-alghoritm/word-formats/utils';
import { RequiredParamsForTransform, ShowTestDataFormat } from '../../../../../testing-alghoritm/word-formats/types';

export function ShowFlashcardFormatWithPhotoAndOptions(
    data: RequiredParamsForTransform<Flashcard>
): ShowTestDataFormat {
    return {
        frontSide: data.rightData[data.showSide],
        backSide: data.rightData[data.showSide === 'word' ? 'translate' : 'word'],
        answerOptions: CreateTestDataOptions(data.rightData, data.dataArr!, data.showSide === 'word' ? 'translate' : 'word'),
        photo: data.rightData.photoUrl
    }
}