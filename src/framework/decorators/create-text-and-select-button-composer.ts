import { TelegramContext } from '../classes/ctx.class';
import { Constructor } from '../types/contructor.type';
import { UnitedComposerStructure } from '../types/united-composer-structure.type';
import { CreateComposer } from '../utils/create-composer.util';
import 'reflect-metadata';

export function CreateTextAndSelectButtonComposer() {
    return function (target: Constructor<UnitedComposerStructure>) {
        CreateComposer(target, function (composer, afterInput) {
            composer.on('text', async function (ctx: any){
                //@ts-ignore
                afterInput.call(this, new TelegramContext(ctx));

                //@ts-ignore
            }.bind(this));

            composer.on('callback_query', async function (ctx: any){
                //@ts-ignore
                this.afterSelectButton.call(this, new TelegramContext(ctx));

                //@ts-ignore
            }.bind(this));
        })
    }
}