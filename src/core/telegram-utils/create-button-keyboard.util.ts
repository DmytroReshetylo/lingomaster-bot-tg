import { Markup } from 'telegraf';

export function createButtonKeyboard(actions: {text: string, data: string}[]) {
    return Markup.inlineKeyboard(actions.map(({text, data}) => [Markup.button.callback(text, data)]));
}