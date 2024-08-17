import { Composer } from 'telegraf';
import { TelegramContext } from '../../../ctx.class';
import { Ctx } from '../../../types';
import { buttonConfig } from './configs';

export function CreateSelectBigButtonComposer(param: string, actions: string[] | 'any', isCancel?: boolean) {
    return function (target: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) {
        const method = descriptor.value;
        const composer = new Composer<any>();

        descriptor.value = () => {
            composer!.on('text', (ctx: Ctx) => {
                const tgCtx = new TelegramContext(ctx);

                ctx.wizard.state[param] = buttonConfig.transformSelectBigButton(ctx.text, tgCtx);

                if(isCancel && buttonConfig.signalCancel(ctx.wizard.state[param], ctx)) {
                    buttonConfig.messageCancel(tgCtx);

                    return ctx.scene.leave();
                }

                if(actions !== 'any' && actions.includes(ctx.wizard.state[param])) {
                    method(tgCtx);
                }
            });

            return composer;
        }
    }
}