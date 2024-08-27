import { TelegramContext } from '../../../ctx.class';
import { bot } from '../../../start.alghoritm';

export function registerNotFoundCommand(messageCommandNotFound: (ctx: any) => void) {
    bot.on('text', (ctx: any) => {
        const tgCtx = new TelegramContext(ctx);

        messageCommandNotFound(tgCtx);
    });
}