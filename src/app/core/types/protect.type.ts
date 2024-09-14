export type Protect = {
    middlewares: (() => string | null)[];
    errors: ((err: any) => string | null)[];
}