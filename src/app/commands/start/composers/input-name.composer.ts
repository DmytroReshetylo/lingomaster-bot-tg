import { TelegramContext } from '../../../../framework/classes/ctx.class';
import { CreateInputTextComposer } from '../../../../framework/decorators/create-text-composer';
import { LanguageListConstant } from '../../../core/constants/language-list.constant';
import { Protect } from '../../../core/types/protect.type';
import { createButtonKeyboard } from '../../../core/utils/create-button-keyboard.util';
import { CreateDataButtonFormat } from '../../../core/utils/create-data-button-format.util';
import { GetTranslateLanguage } from '../../../core/utils/get-translate-language.util';
import { SelectButtonComposerWithoutTransform } from '../../../shared/classes/select-button-composer-without-transform.class';

@CreateInputTextComposer()
export class InputNameComposer extends SelectButtonComposerWithoutTransform {

    readonly cancelButton = false;
    readonly listAvailableActions = LanguageListConstant;
    readonly nameState = 'nativeLanguage';

    beforeInput(ctx: TelegramContext) {
        ctx.reply(
            'SIGN_UP.SELECT_NATIVE_LANGUAGE',
            createButtonKeyboard(CreateDataButtonFormat(this.listAvailableActions, this.translator, GetTranslateLanguage(ctx)))
        );
    }

    codeIfAvailableAction(ctx: TelegramContext) {
        ctx.scene.nextComposer();
    }

    protect(): Protect {
        return {
            middlewares: [],
            errors: []
        };
    }
}