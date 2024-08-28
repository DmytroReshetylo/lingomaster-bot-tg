import { TestManaging } from '../../testing-alghoritm/types';
import { ServiceJson } from '../../services/database/service-json.type';
import { TelegramContext } from '../../../core/ctx.class';
import { AvailableTestModel } from '../../commands/vocabulary/scenes/study-flashcards-strategy/enums';
import { DifferentKeys } from '../../testing-alghoritm/word-formats/utils';
import { TestSendQuestionPartAction } from '../part-actions/test-send-question.part-action';

export async function CreateStartTestAction<
    T extends Record<string, any>,
    TT extends ServiceJson,
    K1 extends keyof T & string,
    K2 extends DifferentKeys<T, K1> & string
>(
    ctx: TelegramContext,
    testManaging: TestManaging<T, TT>,
    model: AvailableTestModel,
    paramSides: [K1, K2]
) {
    await testManaging.testMessageProvider.sendStarted();

    await TestSendQuestionPartAction(ctx, testManaging, model, paramSides);

    ctx.scene.nextAction();
}