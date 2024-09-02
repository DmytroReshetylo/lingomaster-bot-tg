import { TelegramContext } from '../../../core/ctx.class';
import { Languages } from '../../../core/language-interface/enums';
import { translate, translateArray } from '../../../core/language-interface/translate.alghoritm';
import { createBigButtonKeyboard, createButtonKeyboard } from '../../../core/telegram-utils';
import { transformToButtonActions } from '../utils';

export function CreateReplyAction(ctx: TelegramContext, message: string, language: Languages | null, typeButtons?: 'bigButton' | 'button', buttons?: string[]) {
    if(typeButtons && !buttons) {
        throw new Error('You cannot set typeButton parameter if you didn\'t set buttons');
    }

    if(language) {
        message = translate(message, language);
    }

    switch (typeButtons) {
        case 'button': {
            const transformedButtons = language ? transformToButtonActions(buttons!, language) : buttons!.map(action => ({text: action, data: action}));

            ctx.reply(message, createButtonKeyboard(transformedButtons));

            break;
        }

        case 'bigButton': {
            const transformedButtons = language ? translateArray(buttons!, language) : buttons!;

            ctx.reply(message, createBigButtonKeyboard(transformedButtons));

            break;
        }

        default: {
            ctx.reply(translate(message, language));

            break;
        }
    }

    ctx.scene.nextAction();
}