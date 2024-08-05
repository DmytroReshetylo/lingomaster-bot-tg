import { Markup } from 'telegraf';
import { translate } from '../language-interface/translate.alghoritm';
import { InterfaceLanguages, Languages } from '../language-interface/enums';

export function createButtonKeyboard(actions: {text: string, data: string}[]) {
    return Markup.inlineKeyboard(actions.map(({text, data}) => [Markup.button.callback(text, data)]));
}