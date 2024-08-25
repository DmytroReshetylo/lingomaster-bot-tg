import { TelegramContext } from '../../../core/ctx.class';
import { translate } from '../../../core/language-interface/translate.alghoritm';
import { createButtonKeyboard } from '../../../core/telegram-utils';
import { MessageInfo } from '../../../core/types';
import { getNavigationButtons, transformToButtonActions } from '../../shared/utils';
import { ShowTestDataFormat } from '../word-formats/types';
import { AnswerResult } from './enums';
import { QuestionProvider } from './question-provider.class';

export class TestMessageProvider {
    private ctx: TelegramContext;
    private questionProvider: QuestionProvider<any>;
    protected listAnswers: {type: AnswerResult, answer: (data: ShowTestDataFormat) => Promise<MessageInfo> }[] = [
        {
            type: AnswerResult.Correct,
            answer: data => this.ctx.reply(translate('STUDYING.CORRECT_ANSWER', this.ctx.session['user'].interfaceLanguage))
        },
        {
            type: AnswerResult.AlmostCorrect,
            answer: data => this.ctx.reply(`${translate('STUDYING.ALMOST_CORRECT_ANSWER', this.ctx.session['user'].interfaceLanguage)} ${data.backSide}`)
        },
        {
            type: AnswerResult.Synonym,
            answer: data => this.ctx.reply(`${translate('STUDYING.SYNONYM', this.ctx.session['user'].interfaceLanguage)} ${data.backSide}`)
        },
        {
            type: AnswerResult.Incorrect,
            answer: data => this.ctx.reply(`${translate('STUDYING.INCORRECT_ANSWER', this.ctx.session['user'].interfaceLanguage)} ${data.backSide}`)
        }
    ];

    constructor(ctx: TelegramContext, questionProvider: QuestionProvider<any>) {
        this.ctx = ctx;
        this.questionProvider = questionProvider;
    }

    async sendQuestion(data: ShowTestDataFormat) {
        return await this.questionProvider.sendQuestion(data);
    }

    async sendStarted() {
        return await this.ctx.reply(
            translate('STUDYING.STARTED', this.ctx.session['user'].interfaceLanguage),
            createButtonKeyboard(transformToButtonActions(['BUTTONS.CANCEL'], this.ctx.session['user'].interfaceLanguage)
            )
        );
    }

    async sendFinished() {
        return await this.ctx.reply(
            translate('STUDYING.FINISHED', this.ctx.session['user'].interfaceLanguage),
            getNavigationButtons()
        );
    }

    async sendAnswer(type: AnswerResult, data: ShowTestDataFormat) {
        const answerFormat = this.listAnswers.find(answerFormat => answerFormat.type === type)!;

        return await answerFormat.answer(data);
    }
}