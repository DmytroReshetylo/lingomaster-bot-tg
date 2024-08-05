import { createBigButtonKeyboard } from '../../../core/telegram-utils';

export function getNavigationButtons() {
    return createBigButtonKeyboard(['/vocabulary', '/interface']);
}