import { transformLanguageToJsonFormat } from '../utils';
import { AvailableInterfaceLanguages } from './available-interface-languages.concant';

export const AvailableInterfaceLanguagesJsonFormat = transformLanguageToJsonFormat(Object.values(AvailableInterfaceLanguages));