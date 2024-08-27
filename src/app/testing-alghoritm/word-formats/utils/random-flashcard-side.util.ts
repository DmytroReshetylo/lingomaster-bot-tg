import { random } from '../../../shared/utils';

export function RandomSide() {
    return random(0, 1) ? 'word' : 'translate';
}