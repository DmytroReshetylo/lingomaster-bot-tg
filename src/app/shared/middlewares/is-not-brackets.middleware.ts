import { TelegramContext } from '../../../core/ctx.class';

export function IsNotBracketsMiddleware(param: string) {

    return function (ctx: TelegramContext) {
        if(ctx.scene.states[param].includes('[') || ctx.scene.states[param].includes(']')) {
            return 'MIDDLEWARES.PROHIBITED_BRACKETS';
        }

        return null;
    }

}