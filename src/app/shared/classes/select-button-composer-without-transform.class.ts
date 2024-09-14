import { injectable } from 'inversify';
import { TelegramContext } from '../../../framework/classes/ctx.class';
import { GetTranslateLanguage } from '../../core/utils/get-translate-language.util';
import { ComposerWithProtect } from './composer-with-protect.class';

@injectable()
export abstract class SelectButtonComposerWithoutTransform extends ComposerWithProtect {
    abstract readonly nameState: string;
    abstract readonly listAvailableActions: any[];
    abstract readonly cancelButton: boolean;

    async afterInputWithCheck(ctx: TelegramContext) {
        ctx.scene.states[this.nameState] = ctx.data;

        if(this.cancelButton && ctx.scene.states[this.nameState] === 'BUTTONS.CANCEL') {
            await ctx.reply(this.translator.translate('DEFAULT_MESSAGES.CANCELLED', GetTranslateLanguage(ctx)));
        }

        if(this.listAvailableActions.includes(ctx.data)) {
            this.codeIfAvailableAction(ctx);
        }
    }

    abstract codeIfAvailableAction(ctx: TelegramContext): void;
}