import { TelegramContext } from '../../../core/ctx.class';
import { EntityLearningType } from '../../services/database/types/entity-learning.type';
import { TestManaging } from '../../testing-alghoritm/types';

export async function TestAnswerHandlingPartAction<
    T extends {photoUrl: string | null},
    TT extends EntityLearningType<T>,
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