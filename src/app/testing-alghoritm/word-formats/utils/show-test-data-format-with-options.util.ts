import { RequiredParamsForTransform, ShowTestDataFormat } from '../types';
import { CreateTestDataOptions } from './index';

export function ShowDataTestFormatWithOptions<T extends Record<string, any>>(
    data: RequiredParamsForTransform<T>
): ShowTestDataFormat {
    return {
        frontSide: data.rightData[data.showSide],
        backSide: data.rightData[data.backSide],
        answerOptions: CreateTestDataOptions(data.rightData, data.dataArr!, data.backSide)
    }
}