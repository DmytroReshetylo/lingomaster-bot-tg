export type RequiredParamsForTransform<T> = {
    rightData: T ,
    showSide: 'word' | 'translate',
    dataArr?: T[]
}