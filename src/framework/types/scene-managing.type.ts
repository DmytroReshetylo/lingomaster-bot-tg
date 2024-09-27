export type SceneManaging = {
    nextComposer: () => void;
    backComposer: () => void;
    leaveScene: () => void;
    enterScene: (nameScene: string) => void;
    states: Record<any, any>;
}