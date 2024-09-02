import { createBigButtonKeyboard } from '../../../core/telegram-utils';

export function getNavigationButtons() {
    return createBigButtonKeyboard(['/add_new_learning_language', '/vocabulary', '/texts', '/interface']);
}