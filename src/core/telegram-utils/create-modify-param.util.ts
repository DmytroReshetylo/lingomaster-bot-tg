import { TelegramContext } from '../ctx.class';
import { ModifiedParams } from '../decorators/modify-params/types';

export function createModifyParam(modify: (ctx: TelegramContext, ...args: any[]) => any) {
    return function (...args: any[]) {
        return function(target: Object, propertyKey: string | symbol, parameterIndex: number) {
            const existingModifiedParams: ModifiedParams = Reflect.getOwnMetadata('modifiedParams', target, propertyKey) || new Map<number, [(ctx: TelegramContext) => any, args: any[]]>();

            existingModifiedParams.set(parameterIndex, [modify, args]);

            Reflect.defineMetadata('modifiedParams', existingModifiedParams, target, propertyKey);
        }
    }
}