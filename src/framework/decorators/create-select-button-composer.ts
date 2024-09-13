import { TelegramContext } from '../classes/ctx.class';
import { ComposerStructure } from '../types/composer-structure.type';
import { Constructor } from '../types/contructor.type';
import { CreateComposer } from '../utils/create-composer.util';
import 'reflect-metadata';

export function CreateSelectButtonComposer() {
    return function (target: Constructor<ComposerStructure>) {
        CreateComposer(target, function (composer, afterInput) {
            composer.on('callback_query', async(ctx: any) => {
                afterInput(new TelegramContext(ctx));
            });
        })
    }
}