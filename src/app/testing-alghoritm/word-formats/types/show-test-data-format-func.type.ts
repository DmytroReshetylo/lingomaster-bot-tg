import { RequiredParamsForTransform } from './required-data-for-transform.type';
import { ShowTestDataFormat } from './show-test-data-format.type';

export type ShowTestDataFormatFunc<T> = (
    data: RequiredParamsForTransform<T>
) => ShowTestDataFormat