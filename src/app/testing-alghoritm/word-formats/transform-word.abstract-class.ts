import { RequiredParamsForTransform, ShowTestDataFormat, ShowTestDataFormatFunc } from './types';

export abstract class TransformWord<T, TT> {
    protected listTransforms: { format: TT, transform: ShowTestDataFormatFunc<T> }[] = [];

    protected abstract setListTransforms(): { format: TT, transform: ShowTestDataFormatFunc<T> }[];

    transform(format: TT, data: RequiredParamsForTransform<T> ) {
        this.listTransforms = this.setListTransforms();

        const transformInfo = this.listTransforms.find(transformInfo => transformInfo.format === format)!;

        return transformInfo.transform(data);
    }
}