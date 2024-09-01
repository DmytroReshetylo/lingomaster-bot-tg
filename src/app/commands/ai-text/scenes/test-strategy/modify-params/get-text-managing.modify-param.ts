import { createModifyParam } from '../../../../../../core/telegram-utils';
import { TextManaging } from '../classes';

export const GetTextManaging = createModifyParam(ctx => {
    if(!ctx.scene.states.TextManaging) {
        ctx.scene.states.TextManaging = new TextManaging();
    }

    return ctx.scene.states.TextManaging;
});