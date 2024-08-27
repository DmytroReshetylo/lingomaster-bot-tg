import { TelegramContext } from '../../../core/ctx.class';

export function IsNotBotAndNotGroupMiddleware(ctx: TelegramContext) {
    if(ctx.message.from.is_bot) {
        return 'MIDDLEWARES.YOU_CANT_BE_BOT';
    }

    if(ctx.message.chat.type !== 'private') {
        return 'MIDDLEWARES.MUST_BE_PRIVATE_CHAT';
    }

    return null;
}