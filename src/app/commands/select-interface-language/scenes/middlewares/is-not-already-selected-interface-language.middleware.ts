import { TelegramContext } from '../../../../../core/ctx.class';
import { Languages } from '../../../../../core/language-interface/enums';
import { translate } from '../../../../../core/language-interface/translate.alghoritm';

export function IsNotAlreadySelectedInterfaceLanguageMiddleware(ctx: TelegramContext) {
    ctx.scene.states.interfaceLanguage = translate(ctx.scene.states.interfaceLanguage, Languages.en);

    if(ctx.session['user'].interfaceLanguage === ctx.scene.states.interfaceLanguage) {
        return 'MIDDLEWARES.ALREADY_SELECTED_INTERFACE_LANGUAGE';
    }

    return null;
}