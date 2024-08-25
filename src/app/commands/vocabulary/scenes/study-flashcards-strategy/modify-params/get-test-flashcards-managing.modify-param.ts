import { createModifyParam } from '../../../../../../core/telegram-utils';
import { Flashcard } from '../../../../../services/database/vocabulary/types';
import { Vocabulary } from '../../../../../services/database/vocabulary/vocabulary.entity';
import { vocabularyService } from '../../../../../services/database/vocabulary/vocabulary.service';
import { QueueOnDelete } from '../../../../../shared/classes';
import { TestAnswerHandler } from '../../../../../testing-alghoritm/test-handling/test-answer-handler.class';
import { TestMessageProvider } from '../../../../../testing-alghoritm/test-handling/test-message-provider.class';
import { Testing } from '../../../../../testing-alghoritm/test-strategy/testing.class';
import { TestFlashcardChangeProgress, TestFlashcardQuestionProvider, TestGetNextFlashcard } from '../classes';
import { TestFlashcardTransform } from '../classes/test-flashcard-transform.class';

export const GetTestFlashcardsManaging = createModifyParam(ctx => {
    if(!ctx.scene.states.testMananing) {
        ctx.scene.states.testMananing = {
            queueOnDelete: new QueueOnDelete(ctx),

            strategy: new Testing<Flashcard, Vocabulary>(
                ctx.session['user'],
                ctx.scene.states.language,
                ctx.scene.states.vocabularyManaging.getVocabulary(ctx.scene.states.language).flashcards,
                vocabularyService,
                'flashcards',
                new TestFlashcardChangeProgress(),
                new TestGetNextFlashcard()
            ),

            testMessageProvider: new TestMessageProvider(
                ctx,
                new TestFlashcardQuestionProvider(ctx, ctx.scene.states.model)
            ),

            transformWord: new TestFlashcardTransform(),

            testAnswerHandler: new TestAnswerHandler()
        }
    }

    return ctx.scene.states.testMananing;
});