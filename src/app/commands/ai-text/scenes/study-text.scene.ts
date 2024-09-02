import { Apply, CreateScene } from '../../../../core';
import { TelegramContext } from '../../../../core/ctx.class';
import { ModifyParams } from '../../../../core/decorators/modify-params/modify-params.decorator';
import { CreateSelectButtonComposer, CreateTextComposer } from '../../../../core/decorators/scene/composers';
import { Scene } from '../../../../core/decorators/scene/types';
import { Languages } from '../../../../core/language-interface/enums';
import { AIText } from '../../../services/database/entities/ai-text/text.entity';
import { TextInfo } from '../../../services/database/entities/ai-text/types';
import { EntityNames } from '../../../services/database/entities/entity-names';
import { CreateReplyAction, CreateStartTestAction, SelectLanguageAction } from '../../../shared/actions';
import { QueueOnDelete, StudyLanguageManaging } from '../../../shared/classes';
import { LanguageJsonFormat } from '../../../shared/constants';
import { IsLearningLanguageMiddleware } from '../../../shared/middlewares';
import { GetFromStates, GetQueueOnDelete, GetStudyLanguageManaging, TransformIfNumber } from '../../../shared/modify-params';
import { TestAnswerHandlingPartAction, TestSendQuestionPartAction } from '../../../shared/part-actions';
import { TestManaging } from '../../../testing-alghoritm/types';
import { AvailableTestModel } from '../../vocabulary/scenes/study-flashcards-strategy/enums';
import { IsNotTextsEmptyMiddleware } from './shared/middlewares';
import { ListTextsWithStepsPartAction } from './shared/part-actions';
import { GetTestTextManaging } from './test-strategy/modify-params';

@CreateScene('text-study-scene')
export class TextStudyTextScene implements Scene {
    @ModifyParams()
    start(ctx: TelegramContext, @GetStudyLanguageManaging() studyLanguageManaging: StudyLanguageManaging) {
        SelectLanguageAction(ctx, studyLanguageManaging, true);
    }

    @CreateSelectButtonComposer('language', LanguageJsonFormat, true)
    @Apply({middlewares: [IsLearningLanguageMiddleware, IsNotTextsEmptyMiddleware], possibleErrors: []})
    @ModifyParams()
    afterSelectLanguage(
        ctx: TelegramContext,
        @GetFromStates('language') language: Languages,
        @GetFromStates('texts') texts: AIText[],
        @GetStudyLanguageManaging() studyLanguageManaging: StudyLanguageManaging,
        @GetQueueOnDelete() queueOnDelete: QueueOnDelete
    ) {
        ListTextsWithStepsPartAction(ctx, texts, queueOnDelete);
    }

    @CreateSelectButtonComposer('textId', 'any', true)
    @ModifyParams()
    afterSelectTextID(
        ctx: TelegramContext,
        @GetFromStates('language') language: Languages,
        @TransformIfNumber('textId') textId: 'BUTTONS.NEXT' | 'BUTTONS.BACK' | number,
        @GetFromStates('texts') texts: AIText[],
        @GetStudyLanguageManaging() studyLanguageManaging: StudyLanguageManaging,
        @GetQueueOnDelete() queueOnDelete: QueueOnDelete
    ) {
        ListTextsWithStepsPartAction(ctx, texts, queueOnDelete, textId, async() => {
            CreateReplyAction(
                ctx,
                'INFO.SELECT_ACTION',
                ctx.session[EntityNames.User].interfaceLanguage,
                'button',
                Object.values(AvailableTestModel)
            );
        });
    }

    @CreateSelectButtonComposer('model', Object.values(AvailableTestModel), true)
    @Apply({middlewares: [], possibleErrors: []})
    @ModifyParams()
    async afterSelectModel(
        ctx: TelegramContext,
        @GetTestTextManaging() testTextManaging: TestManaging<TextInfo>
    ) {
        await CreateStartTestAction(ctx, testTextManaging, ctx.scene.states.model, ['word', 'translate']);
    }

    @CreateTextComposer('answer', true)
    @Apply({middlewares: [], possibleErrors: []})
    @ModifyParams()
    async afterInputAnswer(
        ctx: TelegramContext,
        @GetTestTextManaging() testTextManaging: TestManaging<TextInfo>
    ) {
        await TestAnswerHandlingPartAction(ctx, testTextManaging, ctx.scene.states.answer);

        await TestSendQuestionPartAction(ctx, testTextManaging, ctx.scene.states.model, ['word', 'translate']);
    }
}