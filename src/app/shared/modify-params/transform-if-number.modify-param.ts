import { TelegramContext } from '../../../core/ctx.class';
import { createModifyParam } from '../../../core/telegram-utils';

export const TransformIfNumber = createModifyParam((ctx: TelegramContext, state: string) => {
    if(isNaN(ctx.scene.states[state])) {
        return ctx.scene.states[state];
    }

    ctx.scene.states[state] = Number(ctx.scene.states[state]);

    return ctx.scene.states[state];
});