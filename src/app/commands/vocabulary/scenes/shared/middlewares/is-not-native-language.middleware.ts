import { TelegramContext } from '../../../../../../core/ctx.class';
import { EntityNames } from '../../../../../services/database/entities/entity-names';
import { transformLanguageToJsonFormat } from '../../../../../shared/utils';

export function IsNotNativeLanguageMiddleware(ctx: TelegramContext) {
    if(transformLanguageToJsonFormat([ctx.session[EntityNames.User].nativeLanguage])[0] === ctx.scene.states.language) {
        return 'MIDDLEWARES.CANT_STUDY_NATIVE_LANGUAGE';
    }

    return null;
}