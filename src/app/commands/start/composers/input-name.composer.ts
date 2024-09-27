import { TelegramContext } from '../../../../framework/classes/ctx.class';
import { CreateInputTextComposer } from '../../../../framework/decorators/create-text-composer';
import { Protect } from '../../../core/types/protect.type';
import { GetTranslateLanguage } from '../../../core/utils/get-translate-language.util';
import { ComposerWithoutTransform } from '../../../shared/composers/composer-without-transform.class';

@CreateInputTextComposer()
export class InputNameComposer extends ComposerWithoutTransform {
    readonly nameState = 'name';

    beforeAnswer(ctx: TelegramContext) {
        ctx.reply(this.translator.translate('SIGN_UP.INPUT_NAME', GetTranslateLanguage(ctx)));
    }

    codeAfterGettingData(ctx: TelegramContext,) {
        ctx.scene.nextComposer();
    }

    protect(): Protect {
        return {
            middlewares: [],
            errors: []
        };
    }
}