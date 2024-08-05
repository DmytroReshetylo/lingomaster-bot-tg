import { random } from '../../../../../shared/utils';

export function RandomFlashcardSide() {
    return random(0, 1) ? 'word' : 'translate';
}