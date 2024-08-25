import { createBigButtonKeyboard } from '../../../../../../core/telegram-utils';
import { QuestionProvider } from '../../../../../testing-alghoritm/test-handling/question-provider.class';
import { ShowTestDataFormat } from '../../../../../testing-alghoritm/word-formats/types';
import { AvailableTestFlashcardModel } from '../enums';

export class TestFlashcardQuestionProvider extends QuestionProvider<AvailableTestFlashcardModel> {
    protected setSelectedModels() {
        return [
            {
                model: AvailableTestFlashcardModel.WithOptions,
                message: (data: ShowTestDataFormat) => {
                    return this.ctx.reply(this.getQuestion(data), createBigButtonKeyboard(data.answerOptions as string[]));
                }
            },
            {
                model: AvailableTestFlashcardModel.WithPhoto,
                message: (data: ShowTestDataFormat) => {
                    if (!data.photo) {
                        return this.listModelActions.find(modelAction => modelAction.model === AvailableTestFlashcardModel.WithoutPhotoAndOptions)!.message(data);
                    }
                    return this.ctx.sendPhoto(data.photo, this.getQuestion(data));
                }
            },
            {
                model: AvailableTestFlashcardModel.WithPhotoAndOptions,
                message: (data: ShowTestDataFormat) => {
                    if (!data.photo) {
                        return this.listModelActions.find(modelAction => modelAction.model === AvailableTestFlashcardModel.WithOptions)!.message(data);
                    }
                    return this.ctx.sendPhoto(data.photo, this.getQuestion(data), createBigButtonKeyboard(data.answerOptions as string[]));
                }
            },
            {
                model: AvailableTestFlashcardModel.WithoutPhotoAndOptions,
                message: (data: ShowTestDataFormat) => {
                    return this.ctx.reply(this.getQuestion(data));
                }
            }
        ];
    }
}
