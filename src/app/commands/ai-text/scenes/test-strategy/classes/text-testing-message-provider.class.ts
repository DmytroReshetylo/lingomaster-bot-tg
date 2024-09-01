import { TelegramContext } from '../../../../../../core/ctx.class';
import { QuestionProvider } from '../../../../../testing-alghoritm/test-handling/question-provider.class';
import { TestMessageProvider } from '../../../../../testing-alghoritm/test-handling/test-message-provider.class';
import { ShowTestDataFormat } from '../../../../../testing-alghoritm/word-formats/types';
import { TextManaging } from './text-managing.class';

export class TextTestingMessageProvider extends TestMessageProvider {
    private textManaging: TextManaging;

    constructor(ctx: TelegramContext, questionProvider: QuestionProvider, textManaging: TextManaging) {
        super(ctx, questionProvider)

        this.textManaging = textManaging;
    }

    async sendQuestion(data: ShowTestDataFormat) {
        const fragment = this.textManaging.getFragmentWithFlashcard(this.ctx.scene.states.wordID)!;

        data.frontSide = this.textManaging.replaceEmpty(fragment, data.frontSide);

        return super.sendQuestion(data);
    }
}