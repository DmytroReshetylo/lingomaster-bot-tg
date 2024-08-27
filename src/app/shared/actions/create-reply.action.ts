import { TelegramContext } from '../../../core/ctx.class';
import { Languages } from '../../../core/language-interface/enums';
import { translate, translateArray } from '../../../core/language-interface/translate.alghoritm';
import { createBigButtonKeyboard, createButtonKeyboard } from '../../../core/telegram-utils';
import { transformToButtonActions } from '../utils';

export function CreateReplyAction(ctx: TelegramContext, message: string, language: Languages, typeButtons?: 'bigButton' | 'button', buttons?: string[]) {
    if(typeButtons && !buttons) {
        throw new Error('You cannot set typeButton parameter if you didn\'t set buttons');
    }

    switch (typeButtons) {
        case 'button': {
            ctx.reply(
                translate(message, language),
                createButtonKeyboard(transformToButtonActions(buttons!, language))
            );

            break;
        }

        case 'bigButton': {
            ctx.reply(
                translate(message, language),
                createBigButtonKeyboard(translateArray(buttons!, language))
            );

            break;
        }

        default: {
            ctx.reply(translate(message, language));

            break;
        }
    }

    ctx.scene.nextAction();
}