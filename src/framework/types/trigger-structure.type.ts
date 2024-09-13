import { TelegramContext } from '../classes/ctx.class';

export type TriggerStructure = {
    code: (ctx: TelegramContext) => void;
}