import { TelegramContext } from '../../../../../../core/ctx.class';
import { transformLanguageToJsonFormat } from '../../../../../shared/utils';

export function IsNotNativeLanguageMiddleware(ctx: TelegramContext) {
    if(transformLanguageToJsonFormat([ctx.session['user'].nativeLanguage])[0] === ctx.scene.states.language) {
        return 'MIDDLEWARES.CANT_STUDY_NATIVE_LANGUAGE';
    }

    return null;
}