import { Languages } from '../../../../../core/language-interface/enums';
import { translate } from '../../../../../core/language-interface/translate.alghoritm';
import { Ctx } from '../../../../../core/types';

export function IsNotAlreadySelectedInterfaceLanguageMiddleware(ctx: Ctx) {
    ctx.wizard.state.interfaceLanguage = translate(ctx.wizard.state.interfaceLanguage, Languages.en);

    if(ctx.session.user.interfaceLanguage === ctx.wizard.state.interfaceLanguage) {
        return 'MIDDLEWARES.ALREADY_SELECTED_INTERFACE_LANGUAGE';
    }

    return null;
}