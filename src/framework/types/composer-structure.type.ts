import { TelegramContext } from '../classes/ctx.class';

export type ComposerStructure = {
    beforeAnswer: (ctx: TelegramContext) => void;
    afterAnswer: (ctx: TelegramContext) => void;
}