import { TelegramContext } from '../classes/ctx.class';

export type UnitedInputAndSelectComposerStructure = {
    beforeAnswer: (ctx: TelegramContext) => void;
    afterInputAnswer: (ctx: TelegramContext) => void;
    afterSelectButtonAnswer: (ctx: TelegramContext) => void;
}