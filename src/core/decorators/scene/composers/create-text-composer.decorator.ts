import { Composer } from 'telegraf';
import { Ctx } from '../../../types';
import { buttonConfig } from './configs';

export function CreateTextComposer(param: string, isButtonCancel?: boolean, isBigButtonCancel?: boolean) {
    return function (target: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) {
        const method = descriptor.value;
        const composer = new Composer<any>();

        descriptor.value = () => {
            composer!.on('text', (ctx: Ctx) => {
                ctx.wizard.state[param] = ctx.text;

                if(isBigButtonCancel && buttonConfig.signalCancel(ctx.wizard.state[param], ctx)) {
                    buttonConfig.messageCancel(ctx);

                    return ctx.scene.leave();
                }

                method(ctx);
            });

            if(isButtonCancel) {
                composer.on('callback_query', (ctx: Ctx) => {
                    if(buttonConfig.signalCancel(ctx.callbackQuery.data, ctx)) {
                        buttonConfig.messageCancel(ctx);

                        return ctx.scene.leave();
                    }
                });
            }

            return composer
        }
    }
}