import { bot } from '../../../start.alghoritm';
import { Ctx } from '../../../types';
import { Languages } from '../../../language-interface/enums';
import { translate } from '../../../language-interface/translate.alghoritm';

export function registerNotFoundCommand(messageCommandNotFound: (ctx: Ctx) => void) {
    bot.on('text', (ctx: Ctx) => {
        messageCommandNotFound(ctx);
    });
}