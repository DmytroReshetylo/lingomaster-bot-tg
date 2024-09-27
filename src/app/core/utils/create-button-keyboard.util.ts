import { Markup } from 'telegraf';
import { Button } from '../types/button.type';

export function createButtonKeyboard(actions: Button[]) {
    return Markup.inlineKeyboard(actions.map(({text, data}) => [Markup.button.callback(text, data)]));
}