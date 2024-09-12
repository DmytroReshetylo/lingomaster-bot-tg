import { Markup } from 'telegraf';

export function createBigButtonKeyboard(actions: string[]) {
    return Markup.keyboard(actions.map((action) => [action])).oneTime().resize();
}