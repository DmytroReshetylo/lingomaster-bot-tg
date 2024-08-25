import { TelegramContext } from '../../../ctx.class';

export type ModifiedParams = Map<number, [(ctx: TelegramContext, args?: any[]) => any, args: any[]]>;