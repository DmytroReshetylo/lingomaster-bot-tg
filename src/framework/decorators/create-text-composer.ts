import { TelegramContext } from '../classes/ctx.class';
import { ComposerStructure } from '../types/composer-structure.type';
import { Constructor } from '../types/contructor.type';
import { CreateComposer } from '../utils/create-composer.util';
import 'reflect-metadata';

export function CreateInputTextComposer() {
    return function (target: Constructor<ComposerStructure>) {
        CreateComposer(target, function (composer, sample) {
            composer.on('text', async function (ctx: any){
                sample.afterAnswer.call(sample, new TelegramContext(ctx));
            });
        })
    }
}