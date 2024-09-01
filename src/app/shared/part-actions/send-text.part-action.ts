import { TelegramContext } from '../../../core/ctx.class';
import { TextManaging } from '../../commands/ai-text/scenes/test-strategy/classes';

export async function SendTextPartAction(ctx: TelegramContext, textManaging: TextManaging, text: string) {
    await ctx.reply(textManaging.deleteBrackets(text));
}