import { Apply, CreateScene } from '../../../../core';
import { TelegramContext } from '../../../../core/ctx.class';
import { ModifyParams } from '../../../../core/decorators/modify-params/modify-params.decorator';
import { CreateSelectButtonComposer, CreateTextComposer } from '../../../../core/decorators/scene/composers';
import { Scene } from '../../../../core/decorators/scene/types';
import { EntityNames } from '../../../services/database/entities/entity-names';
import { Flashcard } from '../../../services/database/entities/vocabulary/types';
import { CreateReplyAction, CreateStartTestAction, SelectLanguageAction } from '../../../shared/actions';
import { StudyLanguageManaging } from '../../../shared/classes';
import { LanguageJsonFormat } from '../../../shared/constants';
import { IsLearningLanguageMiddleware } from '../../../shared/middlewares';
import { GetStudyLanguageManaging } from '../../../shared/modify-params';
import { TestAnswerHandlingPartAction, TestSendQuestionPartAction } from '../../../shared/part-actions';
import { TestManaging } from '../../../testing-alghoritm/types';
import { MinTenFlashcardsMiddleware } from './shared/middlewares';
import { AvailableTestModel } from './study-flashcards-strategy/enums';
import { GetTestFlashcardsManaging } from './study-flashcards-strategy/modify-params/get-test-flashcards-managing.modify-param';

@CreateScene('vocabulary-study-language-scene')
export class VocabularyStudyFlashcardsScene implements Scene {

    @ModifyParams()
    start(ctx: TelegramContext, @GetStudyLanguageManaging() StudyLanguageManaging: StudyLanguageManaging ) {
        SelectLanguageAction(ctx, StudyLanguageManaging, true);
    }

    @CreateSelectButtonComposer('language', LanguageJsonFormat, true)
    @Apply({middlewares: [IsLearningLanguageMiddleware, MinTenFlashcardsMiddleware], possibleErrors: []})
    afterSelectLanguage(ctx: TelegramContext) {
        CreateReplyAction(
            ctx,
            'INFO.SELECT_ACTION',
            ctx.session[EntityNames.User].interfaceLanguage,
            'button',
            Object.values(AvailableTestModel)
        );
    }

    @CreateSelectButtonComposer('model', Object.values(AvailableTestModel), true)
    @Apply({middlewares: [], possibleErrors: []})
    @ModifyParams()
    async afterSelectModel(
        ctx: TelegramContext,
        @GetTestFlashcardsManaging() testFlashcardsManaging: TestManaging<Flashcard>
    ) {
        await CreateStartTestAction(ctx, testFlashcardsManaging, ctx.scene.states.model, ['word', 'translate']);
    }

    @CreateTextComposer('answer', true)
    @Apply({middlewares: [], possibleErrors: []})
    @ModifyParams()
    async afterInputAnswer(
        ctx: TelegramContext,
        @GetTestFlashcardsManaging() testFlashcardsManaging: TestManaging<Flashcard>
    ) {
        await TestAnswerHandlingPartAction(ctx, testFlashcardsManaging, ctx.scene.states.answer);

        await TestSendQuestionPartAction(ctx, testFlashcardsManaging, ctx.scene.states.model, ['word', 'translate']);
    }

}