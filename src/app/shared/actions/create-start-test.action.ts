import { TelegramContext } from '../../../core/ctx.class';
import { AvailableTestModel } from '../../commands/vocabulary/scenes/study-flashcards-strategy/enums';
import { EntityLearningType, JSONLearning } from '../../services/database/types/entity-learning.type';
import { TestManaging } from '../../testing-alghoritm/types';
import { DifferentKeys } from '../../testing-alghoritm/word-formats/utils';
import { TestSendQuestionPartAction } from '../part-actions';

export async function CreateStartTestAction<
    T extends JSONLearning,
    TT extends EntityLearningType<T>,
    K1 extends keyof T & string,
    K2 extends DifferentKeys<T, K1> & string
>(
    ctx: TelegramContext,
    testManaging: TestManaging<T>,
    model: AvailableTestModel,
    paramSides: [K1, K2]
) {
    await testManaging.testMessageProvider.sendStarted();

    await TestSendQuestionPartAction(ctx, testManaging, model, paramSides);

    ctx.scene.nextAction();
}