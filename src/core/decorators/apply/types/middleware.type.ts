import { Ctx } from '../../../types';

export type Middleware = (ctx: Ctx) => (null | string) | Promise<null | string>;