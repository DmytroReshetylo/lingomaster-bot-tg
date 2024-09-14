import { TelegramContext } from '../../../framework/classes/ctx.class';
import { TranslateProvider } from '../../shared/providers/translate.provider';
import { Protect } from '../types/protect.type';
import { GetFirstReturn } from './get-first-return.util';
import { GetTranslateLanguage } from './get-translate-language.util';

export async function ApplyProtect(ctx: TelegramContext, translator: TranslateProvider, protect: Protect, codeAfterCheck: (ctx: TelegramContext) => void) {
    try {
        const result = await GetFirstReturn(null, protect.middlewares);

        if(result) {
            await ctx.reply(result);

            return ctx.scene.backComposer();
        }

        await codeAfterCheck(ctx);
    }
    catch (err: any) {
        const result = await GetFirstReturn(err, protect.errors);

        if(result) {
            await ctx.reply(result);
        }
        else {
            console.log(err);

            await ctx.reply(translator.translate('ERRORS.UNKNOWN_ERROR', GetTranslateLanguage(ctx)));

            ctx.scene.leaveScene();
        }
    }
}