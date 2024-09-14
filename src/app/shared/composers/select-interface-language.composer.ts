import { TelegramContext } from '../../../framework/classes/ctx.class';
import { CreateSelectButtonComposer } from '../../../framework/decorators/create-select-button-composer';
import { Languages } from '../../core/enums/languages.enum';
import { Protect } from '../../core/types/protect.type';
import { createButtonKeyboard } from '../../core/utils/create-button-keyboard.util';
import { CreateDataButtonFormat } from '../../core/utils/create-data-button-format.util';
import { GetTranslateLanguage } from '../../core/utils/get-translate-language.util';
import { TransformAsKeyFormat } from '../../core/utils/transform-as-key-format.util';
import { SelectButtonComposerWithoutTransform } from '../classes/select-button-composer-without-transform.class';

@CreateSelectButtonComposer()
export class SelectInterfaceLanguageComposer extends SelectButtonComposerWithoutTransform {

    readonly cancelButton = false;
    readonly listAvailableActions = TransformAsKeyFormat('LANGUAGES', [Languages.en, Languages.uk]);
    readonly nameState = 'interfaceLanguage';

    beforeInput(ctx: TelegramContext) {
        ctx.reply(
            'DEFAULT_QUESTIONS.SELECT_INTERFACE_LANGUAGE',
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