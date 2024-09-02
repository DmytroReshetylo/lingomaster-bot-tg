import { TextFormat } from '../enums';

export function transformTextFormatToJson(list: TextFormat[]) {
    return list.map((format) => `TEXT.FORMAT_TEXT.${format.toUpperCase()}`);
}