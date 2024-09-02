import { TelegramContext } from '../../../core/ctx.class';
import { translate } from '../../../core/language-interface/translate.alghoritm';
import { EntityNames } from '../../services/database/entities/entity-names';

export function CreateErrorReplyAction(ctx: TelegramContext, message: string) {
    ctx.reply(translate(message, ctx.session[EntityNames.User].interfaceLanguage));

    ctx.scene.leaveScene();
}