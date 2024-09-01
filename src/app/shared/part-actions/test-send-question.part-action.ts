import { TelegramContext } from '../../../core/ctx.class';
import { AvailableTestModel } from '../../commands/vocabulary/scenes/study-flashcards-strategy/enums';
import { EntityNames } from '../../services/database/entities/entity-names';
import { JSONLearning } from '../../services/database/types/entity-learning.type';
import { TestManaging } from '../../testing-alghoritm/types';
import { DifferentKeys, RandomSide } from '../../testing-alghoritm/word-formats/utils';
import { CreateFinishReplyAction } from '../actions';

export async function TestSendQuestionPartAction<
    T extends JSONLearning,
    K1 extends keyof T & string,
    K2 extends DifferentKeys<T, K1> & string
>(
    ctx: TelegramContext,
    testManaging: TestManaging<T>,
    model: AvailableTestModel,
    paramSides: [K1, K2]
) {
    const dataArr = testManaging.strategy.dataTest;

    const sides = RandomSide<T, K1, K2>(paramSides);

    ctx.scene.states.wordID = testManaging.strategy.getNextWordIndex();

    if(ctx.scene.states.wordID === -1) {
        return CreateFinishReplyAction(ctx, 'STUDYING.FINISHED', ctx.session[EntityNames.User].interfaceLanguage);
    }

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