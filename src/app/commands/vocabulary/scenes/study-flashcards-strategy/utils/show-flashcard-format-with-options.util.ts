import { Flashcard } from '../../../../../services/database/vocabulary/types';
import { RequiredParamsForTransform, ShowTestDataFormat } from '../../../../../testing-alghoritm/word-formats/types';
import { CreateTestDataOptions } from '../../../../../testing-alghoritm/word-formats/utils';

export function ShowFlashcardFormatWithOptions(
    data: RequiredParamsForTransform<Flashcard>
): ShowTestDataFormat {
    return {
        frontSide: data.rightData[data.showSide],
        backSide: data.rightData[data.showSide === 'word' ? 'translate' : 'word'],
        answerOptions: CreateTestDataOptions(data.rightData, data.dataArr!, data.showSide === 'word' ? 'translate' : 'word')
    }
}