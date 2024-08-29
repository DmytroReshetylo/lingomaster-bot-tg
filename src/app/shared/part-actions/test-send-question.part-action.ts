import { EntityLearningType } from '../../services/database/types/entity-learning.type';
import { DifferentKeys, RandomSide } from '../../testing-alghoritm/word-formats/utils';
import { TelegramContext } from '../../../core/ctx.class';
import { TestManaging } from '../../testing-alghoritm/types';
import { AvailableTestModel } from '../../commands/vocabulary/scenes/study-flashcards-strategy/enums';

export async function TestSendQuestionPartAction<
    T extends {photoUrl: string | null},
    TT extends EntityLearningType<T>,
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