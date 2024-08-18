import { TelegramContext } from '../ctx.class';
import { ModifiedParams } from '../decorators/modify-params/types';

function createModifyParam(modify: (ctx: TelegramContext) => any) {
    return function(target: Object, propertyKey: string | symbol, parameterIndex: number) {
        const existingModifiedParams: ModifiedParams = Reflect.getOwnMetadata('modifiedParams', target, propertyKey) || new Map<number, (ctx: TelegramContext) => any>();

        existingModifiedParams.set(parameterIndex, modify);

        Reflect.defineMetadata('modifiedParams', existingModifiedParams, target, propertyKey);
    }
}