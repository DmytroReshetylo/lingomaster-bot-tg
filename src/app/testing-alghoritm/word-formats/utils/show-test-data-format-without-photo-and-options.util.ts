import { RequiredParamsForTransform, ShowTestDataFormat } from '../types';

export function ShowDataTestFormatWithoutPhotoAndOptions<T extends Record<string, any>>(
    data: RequiredParamsForTransform<T>
): ShowTestDataFormat {
    return {
        frontSide: data.rightData[data.showSide],
        backSide: data.rightData[data.backSide]
    }
}