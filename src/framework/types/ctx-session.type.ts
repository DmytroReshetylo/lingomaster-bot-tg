export type CtxSession = {
    temp: Map<string, Record<any, any>>;
    session: Record<any, any>;
    sceneComposers: string[];
    indexCurrentComposer: number;
}