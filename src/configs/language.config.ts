import { Languages } from '../core/language-interface/enums';
import * as path from 'path';

export const languageConfig = [
    {language: Languages.uk, path: path.join(__dirname, '../languages', 'ukrainian.json')},
    {language: Languages.en, path: path.join(__dirname, '../languages', 'english.json')}
]