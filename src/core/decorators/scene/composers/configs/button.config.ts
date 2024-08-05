import { Ctx } from '../../../../types';
import { MessageCancel, SignalCancel, TransformSelectBigButton } from './types';

class ButtonConfiguration {
    #signalCancel: SignalCancel = (data: string, ctx: Ctx) => false;
    #messageCancel: MessageCancel = (ctx: Ctx) => ctx.reply('Cancelled!');
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