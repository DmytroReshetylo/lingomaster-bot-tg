import { TelegramContext } from '../classes/ctx.class';
import { ProtectConfig } from './protect-config.type';

export type CodeStructure = {
    code: (ctx: TelegramContext) => void;
    protect: () => ProtectConfig;
}