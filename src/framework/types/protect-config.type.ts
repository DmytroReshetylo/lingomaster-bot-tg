import { TelegramContext } from '../../core/ctx.class';

export type ProtectConfig = {
    middlewares: ((ctx: TelegramContext) => string | null)[];
    errors: ((err: any) => string | null)[];
}