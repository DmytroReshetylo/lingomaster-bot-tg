import { injectable } from 'inversify';
import { Composer } from 'telegraf';
import { WizardScene } from 'telegraf/scenes';
import { botManaging } from '../classes/bot-managing';
import { ButtonCancelConfig } from '../types/button-cancel-config.type';
import { ComposerConfig } from '../types/composer-config.type';
import { CodeStructure } from '../types/composer-structure.type';
import { Constructor } from '../types/contructor.type';
import { ApplyCodeWithProtect } from '../utils/apply-code-with-protect.uril';
import { randomSymbols } from '../utils/random-symbols';
import 'reflect-metadata';

export function CreateTextComposer(config: ButtonCancelConfig & ComposerConfig) {
    return function (target: Constructor<CodeStructure>) {
       injectable()(target);

       const code =  Object.getOwnPropertyDescriptor(target.prototype, 'code')!.value as CodeStructure['code'];

       const protect = Object.getOwnPropertyDescriptor(target.prototype, 'protect')!.value as CodeStructure['protect'];

       const skipComposer = function (ctx: any) {
           ctx.wizard.scene.next();
       }

       const composer = new Composer();

        Object.defineProperty(target.prototype, 'code', {
            value: function() {
                composer.on('text', async(ctx: any) => {
                    await ApplyCodeWithProtect(ctx, code.bind(this), protect());
                });
            }
        })

       const wizard = new WizardScene(randomSymbols(12), skipComposer, composer);

       botManaging.pushStage(wizard);

       Reflect.defineMetadata('wizard', wizard, target);
    }
}