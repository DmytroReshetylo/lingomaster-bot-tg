import { TelegramContext } from '../../../core/ctx.class';
import { translate } from '../../../core/language-interface/translate.alghoritm';
import { createBigButtonKeyboard } from '../../../core/telegram-utils';
import { MessageInfo } from '../../../core/types';
import { AvailableTestModel } from '../../commands/vocabulary/scenes/study-flashcards-strategy/enums';
import { ShowTestDataFormat } from '../word-formats/types';

export class QuestionProvider {
    protected ctx: TelegramContext;
    protected listModelActions: { model: AvailableTestModel, message: (data: ShowTestDataFormat) => Promise<MessageInfo> }[] = [
        {
            model: AvailableTestModel.WithOptions,
            message: (data: ShowTestDataFormat) => {
                return this.ctx.reply(this.getQuestion(data), createBigButtonKeyboard(data.answerOptions as string[]));
            }
        },
        {
            model: AvailableTestModel.WithPhoto,
            message: (data: ShowTestDataFormat) => {
                if (!data.photo) {
                    return this.listModelActions.find(modelAction => modelAction.model === AvailableTestModel.WithoutPhotoAndOptions)!.message(data);
                }
                return this.ctx.sendPhoto(data.photo, this.getQuestion(data));
            }
        },
        {
            model: AvailableTestModel.WithPhotoAndOptions,
            message: (data: ShowTestDataFormat) => {
                if (!data.photo) {
                    return this.listModelActions.find(modelAction => modelAction.model === AvailableTestModel.WithOptions)!.message(data);
                }
                return this.ctx.sendPhoto(data.photo, this.getQuestion(data), createBigButtonKeyboard(data.answerOptions as string[]));
            }
        },
        {
            model: AvailableTestModel.WithoutPhotoAndOptions,
            message: (data: ShowTestDataFormat) => {
                return this.ctx.reply(this.getQuestion(data));
            }
        }
    ];

    private getSelectedModel: { model: AvailableTestModel; message: (data: ShowTestDataFormat) => Promise<MessageInfo> };
    model: AvailableTestModel;

    constructor(ctx: TelegramContext, model: AvailableTestModel) {
        this.ctx = ctx;
        this.model = model;

        this.getSelectedModel = this.listModelActions.find(modelAction => modelAction.model === model)!;
    }

    protected getQuestion(data: ShowTestDataFormat) {
        return `${translate('STUDYING.ASK', this.ctx.session['user'].interfaceLanguage)} ${data.frontSide}`;
    }

    async sendQuestion(data: ShowTestDataFormat) {
        return await this.getSelectedModel.message.apply(this as any, [data]);
    }
}