import { Flashcard } from '../../../../../services/database/vocabulary/types';
import { TransformWord } from '../../../../../testing-alghoritm/word-formats/transform-word.abstract-class';
import { AvailableTestFlashcardModel } from '../enums';
import { ShowFlashcardFormatWithOptions } from '../utils/show-flashcard-format-with-options.util';
import { ShowFlashcardFormatWithPhotoAndOptions } from '../utils/show-flashcard-format-with-photo-and-options.util';
import { ShowFlashcardFormatWithPhoto } from '../utils/show-flashcard-format-with-photo.util';
import { ShowFlashcardFormatWithoutPhotoAndOptions } from '../utils/show-next-flashcard-format-without-photo-and-options.util';

export class TestFlashcardTransform extends TransformWord<Flashcard, AvailableTestFlashcardModel> {

    protected setListTransforms() {
        return [
            {
                format: AvailableTestFlashcardModel.WithOptions,
                transform: ShowFlashcardFormatWithOptions
            },
            {
                format: AvailableTestFlashcardModel.WithPhoto,
                transform: ShowFlashcardFormatWithPhoto
            },
            {
                format: AvailableTestFlashcardModel.WithPhotoAndOptions,
                transform: ShowFlashcardFormatWithPhotoAndOptions
            },
            {
                format: AvailableTestFlashcardModel.WithoutPhotoAndOptions,
                transform: ShowFlashcardFormatWithoutPhotoAndOptions
            }
        ];
    }
}