import { Container } from 'inversify';
import { Composer } from 'telegraf';
import { WizardScene } from 'telegraf/scenes';
import { botManaging } from '../classes/bot-managing';
import { TelegramContext } from '../classes/ctx.class';
import { CodeDefineAfterInput } from '../types/code-define-after-input.type';
import { ComposerStructure } from '../types/composer-structure.type';
import { Constructor } from '../types/contructor.type';

export function LaunchWizard(container: Container, name: string, composer: Constructor<ComposerStructure>) {
    const sample = container.get(composer);

    const codeDefineAfterInput = Reflect.getMetadata('code-define-after-input', composer) as CodeDefineAfterInput;

    const beforeInputStep = function (ctx: any) {
        sample.beforeInput(new TelegramContext(ctx));
    }

    const afterInputStep = new Composer();

    codeDefineAfterInput(afterInputStep, sample.afterInput.bind(sample));

    const wizard = new WizardScene(name, beforeInputStep, afterInputStep);

    botManaging.pushStage(wizard);
}