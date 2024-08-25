import { Apply, CreateScene } from '../../../../core';
import { TelegramContext } from '../../../../core/ctx.class';
import { ModifyParams } from '../../../../core/decorators/modify-params/modify-params.decorator';
import { CreateSelectButtonComposer, CreateTextComposer } from '../../../../core/decorators/scene/composers';
import { Scene } from '../../../../core/decorators/scene/types';
import { translate } from '../../../../core/language-interface/translate.alghoritm';
import { createButtonKeyboard } from '../../../../core/telegram-utils';
import { Flashcard } from '../../../services/database/vocabulary/types';
import { Vocabulary } from '../../../services/database/vocabulary/vocabulary.entity';
import { SelectLanguageAction } from '../../../shared/actions/select-learning-language.action';
import { VocabularyManaging } from '../../../shared/classes';
import { LanguageJsonFormat } from '../../../shared/constants';
import { IsLearningLanguageMiddleware } from '../../../shared/middlewares';
import { GetVocabularyManaging } from '../../../shared/modify-params';
import { transformToButtonActions } from '../../../shared/utils';
import { TestManaging } from '../../../testing-alghoritm/types';
import { RandomSide } from '../../../testing-alghoritm/word-formats/utils';
import { MinTenFlashcardsMiddleware } from './shared/middlewares';
import { AvailableTestFlashcardModel } from './study-flashcards-strategy/enums';
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
        ctx.reply(
            translate('INFO.SELECT_ACTION', ctx.session['user'].interfaceLanguage),
            createButtonKeyboard(transformToButtonActions(Object.values(AvailableTestFlashcardModel), ctx.session['user'].interfaceLanguage))
        );

        ctx.scene.nextAction();
    }

    @CreateSelectButtonComposer('model', Object.values(AvailableTestFlashcardModel), true)
    @Apply({middlewares: [], possibleErrors: []})
    @ModifyParams()
    async afterSelectModel(
        ctx: TelegramContext,
        @GetVocabularyManaging() vocabularyManaging: VocabularyManaging,
        @GetTestFlashcardsManaging() testFlashcardsManaging: TestManaging<Flashcard, Vocabulary, AvailableTestFlashcardModel>
    ) {
        await testFlashcardsManaging.testMessageProvider.sendStarted()

        const wordID = testFlashcardsManaging.strategy.getNextWordIndex();

        const flashcards = vocabularyManaging.getVocabulary(ctx.scene.states.language).flashcards;

        ctx.scene.states.currectWord = testFlashcardsManaging.transformWord.transform(
            ctx.scene.states.model,
            {
                rightData: flashcards[wordID],
                dataArr: flashcards,
                showSide: RandomSide()
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
        @GetTestFlashcardsManaging() testFlashcardsManaging: TestManaging<Flashcard, Vocabulary, AvailableTestFlashcardModel>
    ) {
        testFlashcardsManaging.queueOnDelete.push(ctx.message.message_id);

        const result = await testFlashcardsManaging.testAnswerHandler.check(
            ctx.scene.states.answer,
            ctx.scene.states.currectWord
        );

        let message = await testFlashcardsManaging.testMessageProvider.sendAnswer(result, ctx.scene.states.currectWord);

        testFlashcardsManaging.queueOnDelete.push(message.message_id);

        testFlashcardsManaging.queueOnDelete.deleteAllMessagesInQueue(3000);

        const wordID = testFlashcardsManaging.strategy.getNextWordIndex();

        const flashcards = vocabularyManaging.getVocabulary(ctx.scene.states.language).flashcards;

        ctx.scene.states.currectWord = testFlashcardsManaging.transformWord.transform(
            ctx.scene.states.model,
            {
                rightData: flashcards[wordID],
                dataArr: flashcards,
                showSide: RandomSide()
            }
        );

        message = await testFlashcardsManaging.testMessageProvider.sendQuestion(ctx.scene.states.currectWord);

        testFlashcardsManaging.queueOnDelete.push(message.message_id);
    }

}