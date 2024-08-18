
export type Middleware = (ctx: any) => (null | string) | Promise<null | string>;