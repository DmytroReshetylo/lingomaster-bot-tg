import { Languages } from '../../../core/language-interface/enums';
import { translate } from '../../../core/language-interface/translate.alghoritm';

export function transformToButtonActions(actions: string[], language: Languages) {
    return actions.map(action => ({text: translate(action, language), data: action}));
}