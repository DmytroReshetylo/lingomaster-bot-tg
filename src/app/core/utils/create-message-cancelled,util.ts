import { TelegramContext } from '../../../framework/classes/ctx.class';
import { TranslateProvider } from '../providers/translate.provider';
import { GetTranslateLanguage } from './get-translate-language.util';

export async function CreateMessageCancelled(ctx: TelegramContext, translator: TranslateProvider) {
    await ctx.reply(translator.translate('DEFAULT_MESSAGES.CANCELLED', GetTranslateLanguage(ctx)));

     ctx.scene.leaveScene();
}