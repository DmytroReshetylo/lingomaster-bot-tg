import { TelegramContext } from '../classes/ctx.class';

export type CodeDefineTrigger = (code: (ctx: TelegramContext) => void) => void;