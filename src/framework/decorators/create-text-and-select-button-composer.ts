import { TelegramContext } from '../classes/ctx.class';
import { Constructor } from '../types/contructor.type';
import { UnitedInputAndSelectComposerStructure } from '../types/united-input-and-select-composer-structure.type';
import { CreateComposer } from '../utils/create-composer.util';
import 'reflect-metadata';

export function CreateTextAndSelectButtonComposer() {
    return function (target: Constructor<UnitedInputAndSelectComposerStructure>) {
        CreateComposer<UnitedInputAndSelectComposerStructure>(target, function (composer, sample) {
            composer.on('text', async function (ctx: any){
                sample.afterInputAnswer.call(sample, new TelegramContext(ctx));
            });

            composer.on('callback_query', async function (ctx: any){
                sample.afterSelectButtonAnswer.call(sample, new TelegramContext(ctx));
            });
        })
    }
}