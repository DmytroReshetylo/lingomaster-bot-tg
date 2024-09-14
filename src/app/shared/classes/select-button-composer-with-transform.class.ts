import { injectable } from 'inversify';
import { TelegramContext } from '../../../framework/classes/ctx.class';
import { GetTranslateLanguage } from '../../core/utils/get-translate-language.util';
import { ComposerWithTransform } from './composer-with-transform.class';

@injectable()
export abstract class SelectButtonComposerWithTransform extends ComposerWithTransform {
    abstract readonly listAvailableActions: any[];
    abstract readonly cancelButton: boolean;

    async codeAfterTransform(ctx: TelegramContext) {
        if(this.cancelButton && ctx.scene.states[this.nameState] === 'BUTTONS.CANCEL') {
            await ctx.reply(this.translator.translate('DEFAULT_MESSAGES.CANCELLED', GetTranslateLanguage(ctx)));
        }

        if(this.listAvailableActions.includes(ctx.data)) {
            this.codeIfAvailableAction(ctx);
        }
    }

    abstract codeIfAvailableAction(ctx: TelegramContext): void;
}