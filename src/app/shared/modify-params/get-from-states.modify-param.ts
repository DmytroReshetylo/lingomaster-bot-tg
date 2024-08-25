import { createModifyParam } from '../../../core/telegram-utils';

export const GetFromStates = createModifyParam((ctx, nameParam: string) => {
    return ctx.scene.states[nameParam];
});