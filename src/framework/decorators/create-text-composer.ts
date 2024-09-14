import { TelegramContext } from '../classes/ctx.class';
import { ComposerStructure } from '../types/composer-structure.type';
import { Constructor } from '../types/contructor.type';
import { CreateComposer } from '../utils/create-composer.util';
import 'reflect-metadata';

export function CreateInputTextComposer() {
    return function (target: Constructor<ComposerStructure>) {
        CreateComposer(target, function (composer, afterInput) {
            composer.on('text', async function (ctx: any){
                //@ts-ignore
                afterInput.call(this, new TelegramContext(ctx));

                //@ts-ignore
            }.bind(this));
        })
    }
}