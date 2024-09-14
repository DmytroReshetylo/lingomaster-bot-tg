import { TelegramContext } from '../classes/ctx.class';

export type UnitedComposerStructure = {
    beforeInput: (ctx: TelegramContext) => void;
    afterInput: (ctx: TelegramContext) => void;
    afterSelectButton: (ctx: TelegramContext) => void;
}