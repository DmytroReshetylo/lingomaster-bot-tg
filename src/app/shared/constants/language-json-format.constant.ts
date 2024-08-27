import { Languages } from '../../../core/language-interface/enums';
import { transformLanguageToJsonFormat } from '../utils';

export const LanguageJsonFormat = transformLanguageToJsonFormat(Object.values(Languages) as Languages[]) as Languages[];