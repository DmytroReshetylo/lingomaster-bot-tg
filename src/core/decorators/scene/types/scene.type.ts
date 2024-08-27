import { TelegramContext } from '../../../ctx.class';

export type Scene = {
    start: (ctx: TelegramContext, ...args: any) => void;
}