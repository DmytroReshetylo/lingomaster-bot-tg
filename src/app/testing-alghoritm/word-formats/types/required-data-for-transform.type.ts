export type RequiredParamsForTransform<T extends Record<string, any>> = {
    rightData: T,
    showSide: string,
    backSide: string,
    dataArr?: T[]
}