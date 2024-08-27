import { AvailableTestModel } from '../../commands/vocabulary/scenes/study-flashcards-strategy/enums';
import { RequiredParamsForTransform, ShowTestDataFormatFunc } from './types';
import { ShowDataTestFormatWithOptions, ShowDataTestFormatWithoutPhotoAndOptions, ShowDataTestFormatWithPhoto, ShowDataTestFormatWithPhotoAndOptions } from './utils';

export class TransformWord<T extends Record<string, any>> {
    protected listTransforms: { format: AvailableTestModel, transform: ShowTestDataFormatFunc<T> }[] = [
        {
            format: AvailableTestModel.WithOptions,
            transform: ShowDataTestFormatWithOptions<T>
        },
        {
            format: AvailableTestModel.WithPhoto,
            transform: ShowDataTestFormatWithPhoto<T>
        },
        {
            format: AvailableTestModel.WithPhotoAndOptions,
            transform: ShowDataTestFormatWithPhotoAndOptions<T>
        },
        {
            format: AvailableTestModel.WithoutPhotoAndOptions,
            transform: ShowDataTestFormatWithoutPhotoAndOptions<T>
        }
    ];

    transform(format: AvailableTestModel, data: RequiredParamsForTransform<T> ) {
        const transformInfo = this.listTransforms.find(transformInfo => transformInfo.format === format)!;

        return transformInfo.transform(data);
    }
}