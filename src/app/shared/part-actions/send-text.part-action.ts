import { TelegramContext } from '../../../core/ctx.class';

export async function SendTextPartAction(ctx: TelegramContext, text: string) {
    await ctx.reply(text);
}