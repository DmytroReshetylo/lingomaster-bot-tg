import { TelegramContext } from '../../../ctx.class';

export type Middleware = (ctx: TelegramContext) => (null | string) | Promise<null | string>;