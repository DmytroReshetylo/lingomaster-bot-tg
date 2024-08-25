import { RequiredParamsForTransform, ShowTestDataFormat } from '../types';

export function ShowDataTestFormatWithPhoto<T extends Record<string, any>>(
    data: RequiredParamsForTransform<T>
): ShowTestDataFormat{
    return {
        frontSide: data.rightData[data.showSide],
        backSide: data.rightData[data.backSide],
        photo: data.rightData.photoUrl
    }
}