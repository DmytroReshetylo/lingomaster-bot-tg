import { random } from './random.util';

const symbols = 'abcdefghijklmnopqrstuvwxyz1234567890';

export function randomSymbols(length: number) {
    return (new Array(length).fill(0)).map(() => random(0, symbols.length - 1)).join('');
}