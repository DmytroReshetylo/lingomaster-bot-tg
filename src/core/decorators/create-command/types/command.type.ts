import { TelegramContext } from '../../../ctx.class';

export type Command = {
    command: (ctx: TelegramContext) => void
}