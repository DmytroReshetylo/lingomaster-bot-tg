import { TelegramContext } from '../../../../../core/ctx.class';
import { transformLanguageToJsonFormat } from '../../../../shared/utils';

export function IsNotAlreadySelectedInterfaceLanguageMiddleware(ctx: TelegramContext) {
    if(transformLanguageToJsonFormat([ctx.session['user'].interfaceLanguage])[0] === ctx.scene.states.interfaceLanguage) {
        return 'MIDDLEWARES.ALREADY_SELECTED_INTERFACE_LANGUAGE';
    }

    return null;
}