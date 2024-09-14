import { TelegramContext } from '../../../../framework/classes/ctx.class';
import { CreateInputTextComposer } from '../../../../framework/decorators/create-text-composer';
import { Protect } from '../../../core/types/protect.type';
import { GetTranslateLanguage } from '../../../core/utils/get-translate-language.util';
import { ComposerWithProtect } from '../../../shared/classes/composer-with-protect.class';

@CreateInputTextComposer()
export class InputNameComposer extends ComposerWithProtect {

    beforeInput(ctx: TelegramContext) {
        ctx.reply(this.translator.translate('SIGN_UP.INPUT_NAME', GetTranslateLanguage(ctx)));
    }

    afterInputWithCheck(ctx: TelegramContext) {
        ctx.scene.nextComposer();
    }

    protect(): Protect {
        return {
            middlewares: [],
            errors: []
        };
    }
}