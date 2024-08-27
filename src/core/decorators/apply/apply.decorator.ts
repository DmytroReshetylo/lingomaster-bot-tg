import { TelegramContext } from '../../ctx.class';
import { applyDecoratorConfig } from './configs';
import { Middleware } from './types/middleware.type';
import { PossibleError } from './types/possible-errors.type';
import { checkSomething } from './utils';

export function Apply(config: { middlewares: Middleware[], possibleErrors: PossibleError[] }) {
    return function (target: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) {
        const command = descriptor.value;

        descriptor.value = async(ctx: TelegramContext) => {
            try {
                const result = await checkSomething(ctx, config.middlewares);

                if(result) {
                    ctx.reply(applyDecoratorConfig.transformApplyDecoratorMessage(result as string, ctx));
                } else {
                    return await command(ctx);
                }
            }
            catch (err: any) {
                const result = await checkSomething(err, config.possibleErrors);

                if(result) {
                    ctx.reply(applyDecoratorConfig.transformApplyDecoratorMessage(result as string, ctx));
                } else {
                    console.log(err);

                    ctx.reply(applyDecoratorConfig.unknownCommandMessage(ctx));

                    return ctx.scene.leaveScene();
                }
            }
        }
    }
}