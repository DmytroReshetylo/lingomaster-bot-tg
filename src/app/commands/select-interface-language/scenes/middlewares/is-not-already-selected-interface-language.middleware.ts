import { TelegramContext } from '../../../../../core/ctx.class';
import { EntityNames } from '../../../../services/database/entities/entity-names';
import { transformLanguageToJsonFormat } from '../../../../shared/utils';

export function IsNotAlreadySelectedInterfaceLanguageMiddleware(ctx: TelegramContext) {
    if(transformLanguageToJsonFormat([ctx.session[EntityNames.User].interfaceLanguage])[0] === ctx.scene.states.interfaceLanguage) {
        return 'MIDDLEWARES.ALREADY_SELECTED_INTERFACE_LANGUAGE';
    }

    return null;
}