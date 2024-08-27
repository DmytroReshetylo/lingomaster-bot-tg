export type SceneManaging = {
    nextAction: () => void,
    backAction: () => void,
    leaveScene: () => void,
    enterScene: (nameScene: string) => void,
    states: {[p: string]: any}
}