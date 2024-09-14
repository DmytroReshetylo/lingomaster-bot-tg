import { Container } from 'inversify';
import { Composer } from 'telegraf';
import { WizardScene } from 'telegraf/scenes';
import { botManaging } from '../classes/bot-managing.class';
import { TelegramContext } from '../classes/ctx.class';
import { CodeDefineAfterInput } from '../types/code-define-after-input.type';
import { ComposerStructure } from '../types/composer-structure.type';
import { Constructor } from '../types/contructor.type';
import 'reflect-metadata';

export function CreateWizard(container: Container, name: string, composer: Constructor<ComposerStructure>) {
    const sample = container.get(composer);

    const codeDefineAfterInput = Reflect.getMetadata('code-define-after-input', composer) as CodeDefineAfterInput;

    const beforeInputStep = function (ctx: any) {
        //@ts-ignore
        sample.beforeInput.call(this, new TelegramContext(ctx));

        ctx.wizard.next();
    }

    const afterInputStep = new Composer();

    codeDefineAfterInput.call(sample, afterInputStep, sample.afterInput.bind(sample));

    const wizard = new WizardScene(name, beforeInputStep.bind(sample), afterInputStep);

    botManaging.pushWizard(wizard);
}