import { Ctx } from '../../../core/types';

export function deleteMessages(ctx: Ctx, idMessages: number[]) {
    idMessages.forEach((id) => ctx.deleteMessage(id));
}