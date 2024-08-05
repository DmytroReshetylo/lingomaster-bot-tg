import { Ctx } from '../../../core/types';

export function IsNotBotAndNotGroupMiddleware(ctx: Ctx) {
    if(ctx.message.from.is_bot) {
        return 'MIDDLEWARES.YOU_CANT_BE_BOT';
    }

    if(ctx.message.chat.type !== 'private') {
        return 'MIDDLEWARES.MUST_BE_PRIVATE_CHAT';
    }

    return null;
}