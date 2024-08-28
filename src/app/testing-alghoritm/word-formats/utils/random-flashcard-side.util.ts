import { random } from '../../../shared/utils';

export type DifferentKeys<T, K1 extends keyof T> = keyof T extends K1 ? never : keyof T;

export function RandomSide<T extends Record<string, any>, K1 extends keyof T, K2 extends DifferentKeys<T, K1>>(paramSides: [K1, K2]) {
    const showSide = random(0, 1) ? paramSides[0] : paramSides[1];
    const backSide = paramSides.find(K => K !== showSide)!;

    return {showSide, backSide};
}