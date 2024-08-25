import { TelegramContext } from '../../../core/ctx.class';
import { translate } from '../../../core/language-interface/translate.alghoritm';
import { MessageInfo } from '../../../core/types';
import { ShowTestDataFormat } from '../word-formats/types';

export abstract class QuestionProvider<T> {
    protected ctx: TelegramContext;
    protected listModelActions: { model: T, message: (data: ShowTestDataFormat) => Promise<MessageInfo> }[] = [];

    private getSelectedModel: { model: T; message: (data: ShowTestDataFormat) => Promise<MessageInfo> };
    model: T;

    constructor(ctx: TelegramContext, model: T) {
        this.ctx = ctx;
        this.model = model;

        this.listModelActions = this.setSelectedModels();

        this.getSelectedModel = this.listModelActions.find(modelAction => modelAction.model === model)!;
    }

    protected abstract setSelectedModels(): { model: T; message: (data: ShowTestDataFormat) => Promise<MessageInfo> }[];

    protected getQuestion(data: ShowTestDataFormat) {
        return `${translate('STUDYING.ASK', this.ctx.session['user'].interfaceLanguage)} ${data.frontSide}`;
    }

    async sendQuestion(data: ShowTestDataFormat) {
        return await this.getSelectedModel.message.apply(this as any, [data]);
    }
}