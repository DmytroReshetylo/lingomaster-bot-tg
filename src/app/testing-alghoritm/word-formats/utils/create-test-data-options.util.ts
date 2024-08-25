import { random } from '../../../shared/utils';

export function CreateTestDataOptions<T extends Record<string, any>>(
    rightData: T,
    dataArr: T[],
    backSide: string
) {
    return Array(3).fill(1).reduce((acc: string[]) => {
        for(let index = random(0, dataArr.length - 1); true; index = random(0, dataArr.length - 1)) {
            if(!acc.includes(dataArr[index][backSide])) {
                return random(0, 1) ? [...acc, dataArr[index][backSide]] : [dataArr[index][backSide], ...acc];
            }
        }
    }, [rightData[backSide]]);
}