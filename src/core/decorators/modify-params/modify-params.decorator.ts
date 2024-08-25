import { TelegramContext } from '../../ctx.class';
import { ModifiedParams } from './types';

export function ModifyParams() {
    return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = function(ctx: TelegramContext, ...args: any[]) {
            const modifiedParams: ModifiedParams = Reflect.getOwnMetadata('modifiedParams', target, propertyKey) || new Map<number, (ctx: TelegramContext) => any>();

            for (const [index, [modify, additionArgs]] of modifiedParams) {
                args[index - 1] = modify(ctx, ...additionArgs);
            }

            originalMethod(ctx, ...args);
        };

        return descriptor;
    }
}