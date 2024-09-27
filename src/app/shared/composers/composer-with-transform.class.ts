import { injectable } from 'inversify';
import { TelegramContext } from '../../../framework/classes/ctx.class';
import { GetTranslateLanguage } from '../../core/utils/get-translate-language.util';
import { ComposerWithProtect } from './composer-with-protect.class';

@injectable()
export abstract class ComposerWithTransform extends ComposerWithProtect {
    abstract readonly nameState: string;

    async afterAnswerWithCheck(ctx: TelegramContext) {
        ctx.scene.states[this.nameState] = this.translator.findKey(ctx.data, GetTranslateLanguage(ctx));

        await this.codeAfterTransform(ctx, ctx.scene.states[this.nameState]);
    }

    abstract codeAfterTransform(ctx: TelegramContext, dataAfterTransform: string): void;
}