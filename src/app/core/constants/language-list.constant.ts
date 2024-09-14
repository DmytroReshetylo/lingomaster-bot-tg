import { Languages } from '../enums/languages.enum';
import { TransformAsKeyFormat } from '../utils/transform-as-key-format.util';

export const LanguageListConstant = TransformAsKeyFormat('LANGUAGES', Object.values(Languages));