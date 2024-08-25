import { TelegramContext } from '../../../core/ctx.class';
import { Languages } from '../../../core/language-interface/enums';
import { translate } from '../../../core/language-interface/translate.alghoritm';
import { getNavigationButtons } from '../utils';

export function CreateFinishReplyAction(ctx: TelegramContext, message: string, language?: Languages) {
    if(language) {
        message = translate(message, language);
    }

    ctx.reply(message, getNavigationButtons());

    ctx.scene.leaveScene();
}