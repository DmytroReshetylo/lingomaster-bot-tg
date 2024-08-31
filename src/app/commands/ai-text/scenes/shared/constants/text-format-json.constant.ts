import { TextFormat } from '../enums';
import { transformTextFormatToJson } from '../utils';
import { TextFormatList } from './text-format.constant';


export const TextFormatJson = transformTextFormatToJson(TextFormatList as TextFormat[]);