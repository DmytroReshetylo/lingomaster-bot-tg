import { TranslateProvider } from '../../shared/providers/translate.provider';
import { Languages } from '../enums/languages.enum';

export function CreateDataButtonFormat(keys: string[], translator: TranslateProvider, translateLanguage: Languages) {
    return keys.map(key => ({
        text: translator.translate(key, translateLanguage),
        data: key
    }))
}