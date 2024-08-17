import { TelegramContext } from '../../../ctx.class';
import { bot } from '../../../start.alghoritm';
import { Ctx } from '../../../types';

export function registerNotFoundCommand(messageCommandNotFound: (ctx: Ctx) => void) {
    bot.on('text', (ctx: Ctx) => {
        const tgCtx = new TelegramContext(ctx);

        messageCommandNotFound(tgCtx);
    });
}