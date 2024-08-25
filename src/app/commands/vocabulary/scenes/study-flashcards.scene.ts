import { Apply, CreateScene } from '../../../../core';
import { TelegramContext } from '../../../../core/ctx.class';
import { ModifyParams } from '../../../../core/decorators/modify-params/modify-params.decorator';
import { CreateSelectButtonComposer, CreateTextComposer } from '../../../../core/decorators/scene/composers';
import { Scene } from '../../../../core/decorators/scene/types';
import { translate } from '../../../../core/language-interface/translate.alghoritm';
import { Flashcard } from '../../../services/database/vocabulary/types';
import { Vocabulary } from '../../../services/database/vocabulary/vocabulary.entity';
import { CreateReplyAction, SelectLanguageAction } from '../../../shared/actions';
import { VocabularyManaging } from '../../../shared/classes';
import { LanguageJsonFormat } from '../../../shared/constants';
import { IsLearningLanguageMiddleware } from '../../../shared/middlewares';
import { GetVocabularyManaging } from '../../../shared/modify-params';
import { TestManaging } from '../../../testing-alghoritm/types';
import { RandomSide } from '../../../testing-alghoritm/word-formats/utils';
import { MinTenFlashcardsMiddleware } from './shared/middlewares';
import { AvailableTestModel } from './study-flashcards-strategy/enums';
import { GetTestFlashcardsManaging } from './study-flashcards-strategy/modify-params/get-test-flashcards-managing.modify-param';

@CreateScene('vocabulary-study-language-scene')
export class VocabularyStudyFlashcardsScene implements Scene {

    @ModifyParams()
    start(ctx: TelegramContext, @GetVocabularyManaging() vocabularyManaging: VocabularyManaging ) {
        SelectLanguageAction(ctx, vocabularyManaging, true);
    }

    @CreateSelectButtonComposer('language', LanguageJsonFormat, true)
    @Apply({middlewares: [IsLearningLanguageMiddleware, MinTenFlashcardsMiddleware], possibleErrors: []})
    afterSelectLanguage(ctx: TelegramContext) {
        CreateReplyAction(
            ctx,
            'INFO.SELECT_ACTION',
            ctx.session['user'].interfaceLanguage,
            'button',
            Object.values(AvailableTestModel)
        );
    }

    @CreateSelectButtonComposer('model', Object.values(AvailableTestModel), true)
    @Apply({middlewares: [], possibleErrors: []})
    @ModifyParams()
    async afterSelectModel(
        ctx: TelegramContext,
        @GetVocabularyManaging() vocabularyManaging: VocabularyManaging,
        @GetTestFlashcardsManaging() testFlashcardsManaging: TestManaging<Flashcard, Vocabulary>
    ) {
        await testFlashcardsManaging.testMessageProvider.sendStarted()

        ctx.scene.states.wordID = testFlashcardsManaging.strategy.getNextWordIndex();

        const flashcards = vocabularyManaging.getVocabulary(ctx.scene.states.language).flashcards;

        const showSide = RandomSide();

        ctx.scene.states.currectWord = testFlashcardsManaging.transformWord.transform(
            ctx.scene.states.model,
            {
                rightData: flashcards[ctx.scene.states.wordID],
                dataArr: flashcards,
                showSide: showSide,
                backSide: showSide === 'word' ? 'translate' : 'word'
            }
        );

        const message = await testFlashcardsManaging.testMessageProvider.sendQuestion(ctx.scene.states.currectWord);

        testFlashcardsManaging.queueOnDelete.push(message.message_id);

        ctx.scene.nextAction();
    }

    @CreateTextComposer('answer', true)
    @Apply({middlewares: [], possibleErrors: []})
    @ModifyParams()
    async afterInputAnswer(
        ctx: TelegramContext,
        @GetVocabularyManaging() vocabularyManaging: VocabularyManaging,
        @GetTestFlashcardsManaging() testFlashcardsManaging: TestManaging<Flashcard, Vocabulary>
    ) {
        testFlashcardsManaging.queueOnDelete.push(ctx.message.message_id);

        const result = await testFlashcardsManaging.testAnswerHandler.check(
            ctx.scene.states.answer,
            ctx.scene.states.currectWord
        );

        testFlashcardsManaging.strategy.changeProgress(ctx.scene.states.wordID, result.correct);

        let message = await testFlashcardsManaging.testMessageProvider.sendAnswer(result.message, ctx.scene.states.currectWord);

        testFlashcardsManaging.queueOnDelete.push(message.message_id);

        testFlashcardsManaging.queueOnDelete.deleteAllMessagesInQueue(3000);

        ctx.scene.states.wordID = testFlashcardsManaging.strategy.getNextWordIndex();

        const flashcards = vocabularyManaging.getVocabulary(ctx.scene.states.language).flashcards;

        const showSide = RandomSide();

        ctx.scene.states.currectWord = testFlashcardsManaging.transformWord.transform(
            ctx.scene.states.model,
            {
                rightData: flashcards[ctx.scene.states.wordID],
                dataArr: flashcards,
                showSide: showSide,
                backSide: showSide === 'word' ? 'translate' : 'word'
            }
        );

        message = await testFlashcardsManaging.testMessageProvider.sendQuestion(ctx.scene.states.currectWord);

        testFlashcardsManaging.queueOnDelete.push(message.message_id);
    }

}