import { TelegramContext } from '../../../core/ctx.class';
import { JSONLearning } from '../../services/database/types/entity-learning.type';
import { TestManaging } from '../../testing-alghoritm/types';

export async function TestAnswerHandlingPartAction<T extends JSONLearning>(
   ctx: TelegramContext,
   testManaging: TestManaging<T>,
   answer: string
) {
    testManaging.queueOnDelete.push(ctx.message.message_id);

    const result = await testManaging.testAnswerHandler.check(
        answer,
        ctx.scene.states.currectWord
    );

    testManaging.strategy.changeProgress(ctx.scene.states.wordID, result.correct);

    let message = await testManaging.testMessageProvider.sendAnswer(result.message, ctx.scene.states.currectWord);

    testManaging.queueOnDelete.push(message.message_id);

    testManaging.queueOnDelete.deleteAllMessagesInQueue(5000);
}