import { Languages } from '../enums/languages.enum';
import { TranslateProvider } from '../providers/translate.provider';

export function CreateDataButtonFormat(keys: string[], translator: TranslateProvider, translateLanguage: Languages) {
    return keys.map(key => ({
        text: translator.translate(key, translateLanguage),
        data: key
    }))
}