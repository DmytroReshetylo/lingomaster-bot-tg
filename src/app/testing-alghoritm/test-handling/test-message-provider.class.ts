import { TelegramContext } from '../../../core/ctx.class';
import { translate } from '../../../core/language-interface/translate.alghoritm';
import { createButtonKeyboard } from '../../../core/telegram-utils';
import { MessageInfo } from '../../../core/types';
import { EntityNames } from '../../services/database/entities/entity-names';
import { getNavigationButtons, transformToButtonActions } from '../../shared/utils';
import { ShowTestDataFormat } from '../word-formats/types';
import { AnswerResult } from './enums';
import { QuestionProvider } from './question-provider.class';

export class TestMessageProvider {
    protected ctx: TelegramContext;
    private questionProvider: QuestionProvider;
    protected listAnswers: {type: AnswerResult, answer: (data: ShowTestDataFormat) => Promise<MessageInfo> }[] = [
        {
            type: AnswerResult.Correct,
            answer: data => this.ctx.reply(translate('STUDYING.CORRECT_ANSWER', this.ctx.session[EntityNames.User].interfaceLanguage))
        },
        {
            type: AnswerResult.AlmostCorrect,
            answer: data => this.ctx.reply(`${translate('STUDYING.ALMOST_CORRECT_ANSWER', this.ctx.session[EntityNames.User].interfaceLanguage)} ${data.backSide}`)
        },
        {
            type: AnswerResult.Synonym,
            answer: data => this.ctx.reply(`${translate('STUDYING.SYNONYM', this.ctx.session[EntityNames.User].interfaceLanguage)} ${data.backSide}`)
        },
        {
            type: AnswerResult.Incorrect,
            answer: data => this.ctx.reply(`${translate('STUDYING.INCORRECT_ANSWER', this.ctx.session[EntityNames.User].interfaceLanguage)} ${data.backSide}`)
        }
    ];

    constructor(ctx: TelegramContext, questionProvider: QuestionProvider) {
        this.ctx = ctx;
        this.questionProvider = questionProvider;
    }

    async sendQuestion(data: ShowTestDataFormat) {
        return await this.questionProvider.sendQuestion(data);
    }

    async sendStarted() {
        return await this.ctx.reply(
            translate('STUDYING.STARTED', this.ctx.session[EntityNames.User].interfaceLanguage),
            createButtonKeyboard(transformToButtonActions(['BUTTONS.CANCEL'], this.ctx.session[EntityNames.User].interfaceLanguage)
            )
        );
    }

    async sendFinished() {
        return await this.ctx.reply(
            translate('STUDYING.FINISHED', this.ctx.session[EntityNames.User].interfaceLanguage),
            getNavigationButtons()
        );
    }

    async sendAnswer(type: AnswerResult, data: ShowTestDataFormat) {
        const answerFormat = this.listAnswers.find(answerFormat => answerFormat.type === type)!;

        return await answerFormat.answer(data);
    }
}