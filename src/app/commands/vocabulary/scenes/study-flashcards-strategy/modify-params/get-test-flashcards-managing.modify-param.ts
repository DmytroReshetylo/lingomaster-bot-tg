import { createModifyParam } from '../../../../../../core/telegram-utils';
import { StudyLanguages } from '../../../../../services/database/entities/study-languages/study-language.entity';
import { Flashcard } from '../../../../../services/database/entities/vocabulary/types';
import { vocabularyService } from '../../../../../services/database/entities/vocabulary/vocabulary.service';
import { QueueOnDelete } from '../../../../../shared/classes';
import { QuestionProvider } from '../../../../../testing-alghoritm/test-handling/question-provider.class';
import { TestAnswerHandler } from '../../../../../testing-alghoritm/test-handling/test-answer-handler.class';
import { TestMessageProvider } from '../../../../../testing-alghoritm/test-handling/test-message-provider.class';
import { Testing } from '../../../../../testing-alghoritm/test-strategy/testing.class';
import { TransformWord } from '../../../../../testing-alghoritm/word-formats/transform-word';
import { TestFlashcardChangeProgress, TestGetNextFlashcard } from '../classes';

export const GetTestFlashcardsManaging = createModifyParam(async(ctx) => {
    if(!ctx.scene.states.testMananing) {
        const studyLanguageEntity = ctx.scene.states.StudyLanguageManaging.getEntity(ctx.scene.states.language) as StudyLanguages;

        const vocabulary = (await vocabularyService.getEntity({studyLanguages: {id: studyLanguageEntity.id}}))!;

        ctx.scene.states.testMananing = {
            queueOnDelete: new QueueOnDelete(ctx),

            strategy: new Testing<Flashcard>(
                vocabulary,
                vocabularyService,
                new TestFlashcardChangeProgress(),
                new TestGetNextFlashcard()
            ),

            testMessageProvider: new TestMessageProvider(
                ctx,
                new QuestionProvider(ctx, ctx.scene.states.model)
            ),

            transformWord: new TransformWord<Flashcard>(),

            testAnswerHandler: new TestAnswerHandler()
        }
    }

    return ctx.scene.states.testMananing;
});