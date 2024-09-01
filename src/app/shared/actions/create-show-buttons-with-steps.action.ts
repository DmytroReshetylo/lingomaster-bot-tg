import { TelegramContext } from '../../../core/ctx.class';
import { Languages } from '../../../core/language-interface/enums';
import { translate } from '../../../core/language-interface/translate.alghoritm';
import { createButtonKeyboard } from '../../../core/telegram-utils';
import { QueueOnDelete } from '../classes';
import { transformOBJToButton } from '../utils';

const displayButtonsLength = 5;

export async function CreateButtonsWithStepsAction<
    T extends {id: number, [p: string]: any},
    DISPLAYKEY extends keyof T
>(
    ctx: TelegramContext,
    message: string,
    language: Languages,
    buttons: T[],
    displayKey: DISPLAYKEY,
    queueOnDelete: QueueOnDelete,
    lastChoose?: 'BUTTONS.NEXT' | 'BUTTONS.BACK' | number,
    callback?: Function
) {

    if(!buttons.length) {
        throw Error('Buttons is not found');
    }

    if(!ctx.scene.states.step) {
        ctx.scene.states.step = 1;
    }

    queueOnDelete.deleteAllMessagesInQueue();

    let displayButtons: {text: string, data: any}[] = [];

    switch (true) {
        case lastChoose === 'BUTTONS.NEXT': {
            ctx.scene.states.step = buttons.length > ctx.scene.states.step * displayButtonsLength ? ctx.scene.states.step + 1 : ctx.scene.states.step;
            break
        }
        case lastChoose === 'BUTTONS.BACK': {
            ctx.scene.states.step = ctx.scene.states.step === 1 ? 1 : ctx.scene.states.step - 1;
            break
        }
        case !lastChoose: {
            break;
        }
        default: {
            if(callback && buttons.find(button => button.id === Number(lastChoose))) {
                await callback();
            }

            return;
        }
    }

    const from = (ctx.scene.states.step - 1) * displayButtonsLength;

    const to = ctx.scene.states.step * displayButtonsLength;

    displayButtons = transformOBJToButton(buttons.slice(from, to), displayKey);

    if(buttons.length > to) {
        displayButtons.push({data: 'BUTTONS.NEXT', text: translate('BUTTONS.NEXT', language)});
    }

    if(from !== 0) {
        displayButtons.push({data: 'BUTTONS.BACK', text: translate('BUTTONS.BACK', language)});
    }

    displayButtons.push({data: 'BUTTONS.CANCEL', text: translate('BUTTONS.CANCEL', language)});

    message = translate(message, language);

    const messageInfo = await ctx.reply(message, createButtonKeyboard(displayButtons));

    queueOnDelete.push(messageInfo.message_id);

    if(!lastChoose) {
        ctx.scene.nextAction();
    }

}