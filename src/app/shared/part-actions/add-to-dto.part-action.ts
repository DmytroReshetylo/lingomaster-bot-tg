import { checkValid } from '../utils';

export async function AddToDTOPartAction<T, KEY extends keyof T>(dto: T, key: KEY, value: T[KEY]) {
    dto[key] = value;

    await checkValid(dto);
}