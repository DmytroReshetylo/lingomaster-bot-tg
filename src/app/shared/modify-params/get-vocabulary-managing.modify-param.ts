import { createModifyParam } from '../../../core/telegram-utils';
import { VocabularyManaging } from '../classes';

export const GetVocabularyManaging = createModifyParam(ctx => {
    if(!ctx.scene.states.vocabularyManaging) {
        ctx.scene.states.vocabularyManaging = new VocabularyManaging(ctx);
    }

    return ctx.scene.states.vocabularyManaging;
});