import { Ctx } from '../../../../../../core/types';
import { transformLanguageToJsonFormat } from '../../../../../shared/utils';

export function IsNotNativeLanguageMiddleware(ctx: Ctx) {
    if(transformLanguageToJsonFormat([ctx.session.user.nativeLanguage])[0] === ctx.wizard.state.language) {
        return 'MIDDLEWARES.CANT_STUDY_NATIVE_LANGUAGE';
    }

    return null;
}