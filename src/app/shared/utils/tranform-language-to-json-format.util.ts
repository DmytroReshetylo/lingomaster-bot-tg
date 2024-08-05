import { Languages } from '../../../core/language-interface/enums';

export function transformLanguageToJsonFormat(list: Languages[]) {
    return list.map((language) => `LANGUAGES.${language.toUpperCase()}`);
}