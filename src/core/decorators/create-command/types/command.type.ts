import { Ctx } from '../../../types/ctx.type';

export type Command = {
    command: (ctx: Ctx) => void
}