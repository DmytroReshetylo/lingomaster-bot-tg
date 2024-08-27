import { CreateTestDataOptions } from './index';
import { RequiredParamsForTransform, ShowTestDataFormat } from '../types';

export function ShowDataTestFormatWithPhotoAndOptions<T extends Record<string, any>>(
    data: RequiredParamsForTransform<T>
): ShowTestDataFormat {
    return {
        frontSide: data.rightData[data.showSide],
        backSide: data.rightData[data.backSide],
        answerOptions: CreateTestDataOptions(data.rightData, data.dataArr!, data.backSide),
        photo: data.rightData.photoUrl
    }
}