import { TelegramContext } from '../classes/ctx.class';

export type ComposerStructure = {
    beforeInput: (ctx: TelegramContext) => void,
    afterInput: (ctx: TelegramContext) => void,
}