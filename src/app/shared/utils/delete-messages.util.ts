import { TelegramContext } from '../../../core/ctx.class';

export function deleteMessages(ctx: TelegramContext, idMessages: number[]) {
    idMessages.forEach((id) => ctx.deleteMessage(id));
}