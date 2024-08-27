import { Composer } from 'telegraf';
import { TelegramContext } from '../../../ctx.class';
import { buttonConfig } from './configs';

export function CreateTextComposer(param: string, isButtonCancel?: boolean, isBigButtonCancel?: boolean) {
    return function (target: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) {
        const method = descriptor.value;
        const composer = new Composer<any>();

        descriptor.value = () => {
            composer!.on('text', (ctx: any) => {
                const tgCtx = new TelegramContext(ctx);

                ctx.wizard.state[param] = ctx.text;

                if(isBigButtonCancel && buttonConfig.signalCancel(ctx.wizard.state[param], tgCtx)) {
                    buttonConfig.messageCancel(tgCtx);

                    return ctx.scene.leave();
                }

                method(tgCtx);
            });

            if(isButtonCancel) {
                composer.on('callback_query', (ctx: any) => {
                    const tgCtx = new TelegramContext(ctx);

                    if(buttonConfig.signalCancel(ctx.callbackQuery.data, tgCtx)) {
                        buttonConfig.messageCancel(ctx);

                        return ctx.scene.leave();
                    }
                });
            }

            return composer
        }
    }
}