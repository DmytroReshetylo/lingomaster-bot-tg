import { TelegramContext } from '../../../../framework/classes/ctx.class';
import { CreateSelectButtonComposer } from '../../../../framework/decorators/create-select-button-composer';
import { LanguageListConstant } from '../../../core/constants/language-list.constant';
import { Protect } from '../../../core/types/protect.type';
import { createButtonKeyboard } from '../../../core/utils/create-button-keyboard.util';
import { CreateDataButtonFormat } from '../../../core/utils/create-data-button-format.util';
import { GetTranslateLanguage } from '../../../core/utils/get-translate-language.util';
import { SelectButtonComposerWithoutTransform } from '../../../shared/classes/select-button-composer-without-transform.class';

@CreateSelectButtonComposer()
export class SelectNativeLanguageComposer extends SelectButtonComposerWithoutTransform {

    readonly cancelButton = false;
    readonly listAvailableActions = LanguageListConstant;
    readonly nameState = 'nativeLanguage';

    beforeInput(ctx: TelegramContext) {
        ctx.reply(
            this.translator.translate('SIGN_UP.SELECT_NATIVE_LANGUAGE', GetTranslateLanguage(ctx)),
            createButtonKeyboard(CreateDataButtonFormat(this.listAvailableActions, this.translator, GetTranslateLanguage(ctx)))
        );
    }

    async codeIfAvailableAction(ctx: TelegramContext) {
        await ctx.reply(
            this.translator.translateWithReplace(
                'DEFAULT_MESSAGES.YOU_SELECTED_SOMETHING',
                GetTranslateLanguage(ctx),
                [this.translator.translate(ctx.data, GetTranslateLanguage(ctx))]
            )
        );

        ctx.scene.nextComposer();
    }

    protect(): Protect {
        return {
            middlewares: [],
            errors: []
        };
    }
}