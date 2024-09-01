import { TelegramContext } from '../../../core/ctx.class';

export function IsNotBracketsMiddleware(ctx: TelegramContext) {
    if(ctx.data.includes('[') || ctx.data.includes(']')) {
        return 'MIDDLEWARES.PROHIBITED_BRACKETS';
    }

    return null;
}