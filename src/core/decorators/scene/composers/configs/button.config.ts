import { TelegramContext } from '../../../../ctx.class';
import { MessageCancel, SignalCancel, TransformSelectBigButton } from './types';

class ButtonConfiguration {
    #signalCancel: SignalCancel = (data: string, ctx: TelegramContext) => false;
    #messageCancel: MessageCancel = (ctx: TelegramContext) => ctx.reply('Cancelled!');
    #transformSelectBigButton: TransformSelectBigButton = (data: string) => data;

    setConfiguration(signalCancel: SignalCancel, messageCancel: MessageCancel, transformSelectBigButton: TransformSelectBigButton) {
        this.#signalCancel = signalCancel;
        this.#messageCancel = messageCancel;
        this.#transformSelectBigButton = transformSelectBigButton;
    }

    get signalCancel() {
        return this.#signalCancel;
    }

    get messageCancel() {
        return this.#messageCancel;
    }

    get transformSelectBigButton() {
        return this.#transformSelectBigButton;
    }
}

export const buttonConfig = new ButtonConfiguration();