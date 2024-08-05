export type ShowFlashcardFormat = {
    index: number,
    frontSide: string,
    backSide: string,
    photo?: string | null,
    answerOptions?: string[]
}