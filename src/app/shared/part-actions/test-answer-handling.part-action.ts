import { ServiceWithJson } from '../../services/database/service-with-json.type';
import { TelegramContext } from '../../../core/ctx.class';
import { TestManaging } from '../../testing-alghoritm/types';

export async function TestAnswerHandlingPartAction<
    T extends Record<string, any>,
    TT extends ServiceWithJson,
>(
   ctx: TelegramContext,
   testManaging: TestManaging<T, TT>,
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

    testManaging.queueOnDelete.deleteAllMessagesInQueue(3000);
}