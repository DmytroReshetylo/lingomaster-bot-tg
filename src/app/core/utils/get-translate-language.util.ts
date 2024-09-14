import { TelegramContext } from '../../../framework/classes/ctx.class';
import { Languages } from '../enums/languages.enum';

export function GetTranslateLanguage(ctx: TelegramContext) {
    return ctx.session['user'] ? ctx.session['user'].interfaceLanguage : Languages.en as Languages;
}