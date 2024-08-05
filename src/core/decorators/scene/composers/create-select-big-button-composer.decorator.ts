import { Composer } from 'telegraf';
import { Ctx } from '../../../types';
import { buttonConfig } from './configs';

export function CreateSelectBigButtonComposer(param: string, actions: string[] | 'any', isCancel?: boolean) {
    return function (target: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) {
        const method = descriptor.value;
        const composer = new Composer<any>();

        descriptor.value = () => {
            composer!.on('text', (ctx: Ctx) => {
                ctx.wizard.state[param] = buttonConfig.transformSelectBigButton(ctx.text, ctx);

                if(isCancel && buttonConfig.signalCancel(ctx.wizard.state[param], ctx)) {
                    buttonConfig.messageCancel(ctx);

                    return ctx.scene.leave();
                }

                if(actions !== 'any' && actions.includes(ctx.wizard.state[param])) {
                    method(ctx);
                }
            });

            return composer;
        }
    }
}