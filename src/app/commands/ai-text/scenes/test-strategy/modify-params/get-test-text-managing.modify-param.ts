import { createModifyParam } from '../../../../../../core/telegram-utils';
import { textService } from '../../../../../services/database/entities/ai-text/text.service';
import { TextInfo } from '../../../../../services/database/entities/ai-text/types';
import { Flashcard } from '../../../../../services/database/entities/vocabulary/types';
import { QueueOnDelete, StudyLanguageManaging } from '../../../../../shared/classes';
import { QuestionProvider } from '../../../../../testing-alghoritm/test-handling/question-provider.class';
import { TestAnswerHandler } from '../../../../../testing-alghoritm/test-handling/test-answer-handler.class';
import { Testing } from '../../../../../testing-alghoritm/test-strategy/testing.class';
import { TransformWord } from '../../../../../testing-alghoritm/word-formats/transform-word';
import { TextManaging } from '../../shared/classes';
import { TestTextChangeProgress, TestTextGetNextWord, TextTestingMessageProvider } from '../classes';

export const GetTestTextManaging = createModifyParam(ctx => {
    if(!ctx.scene.states.testMananing) {
        const entity = (ctx.scene.states.StudyLanguageManaging as StudyLanguageManaging)
            .getTexts(ctx.scene.states.language)
            .find(text => text.id === Number(ctx.scene.states.textId))!;

        if(!ctx.scene.states.TextManaging) {
            ctx.scene.states.TextManaging = new TextManaging();
        }

        ctx.scene.states.TextManaging.connectEntity(entity);

        ctx.scene.states.testMananing = {
            queueOnDelete: new QueueOnDelete(ctx),

            strategy: new Testing<TextInfo>(
                entity,
                textService,
                new TestTextChangeProgress(),
                new TestTextGetNextWord()
            ),

            testMessageProvider: new TextTestingMessageProvider(
                ctx,
                new QuestionProvider(ctx, ctx.scene.states.model),
                ctx.scene.states.TextManaging
            ),

            transformWord: new TransformWord<Flashcard>(),

            testAnswerHandler: new TestAnswerHandler()
        }
    }

    return ctx.scene.states.testMananing;
});