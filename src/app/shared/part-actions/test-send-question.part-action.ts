import { DifferentKeys, RandomSide } from '../../testing-alghoritm/word-formats/utils';
import { TelegramContext } from '../../../core/ctx.class';
import { ServiceJson } from '../../services/database/service-json.type';
import { TestManaging } from '../../testing-alghoritm/types';
import { AvailableTestModel } from '../../commands/vocabulary/scenes/study-flashcards-strategy/enums';

export async function TestSendQuestionPartAction<
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
    const dataArr = testManaging.strategy.dataTest;

    const sides = RandomSide<T, K1, K2>(paramSides);

    ctx.scene.states.wordID = testManaging.strategy.getNextWordIndex();

    ctx.scene.states.currectWord = testManaging.transformWord.transform(
        model,
        {
            rightData: dataArr[ctx.scene.states.wordID],
            dataArr: dataArr,
            showSide: sides.showSide,
            backSide: sides.backSide
        }
    );

    const message = await testManaging.testMessageProvider.sendQuestion(ctx.scene.states.currectWord);

    testManaging.queueOnDelete.push(message.message_id);
}