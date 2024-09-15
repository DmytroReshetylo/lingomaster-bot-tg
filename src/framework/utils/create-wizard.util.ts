import { Container } from 'inversify';
import { Composer } from 'telegraf';
import { WizardScene } from 'telegraf/scenes';
import { botManaging } from '../classes/bot-managing.class';
import { TelegramContext } from '../classes/ctx.class';
import { CodeDefineAfterAnswer } from '../types/code-define-after-answer.type';
import { Constructor } from '../types/contructor.type';
import 'reflect-metadata';

export function CreateWizard<T extends { beforeAnswer: (ctx: TelegramContext) => void }>(container: Container, name: string, composer: Constructor<T>) {
    const sample = container.get(composer);

    const codeDefineAfterAnswer = Reflect.getMetadata('code-define-after-answer', composer) as CodeDefineAfterAnswer<T>;

    const beforeAnswerStep = function (ctx: any) {
        sample.beforeAnswer.call(sample, new TelegramContext(ctx));

        ctx.wizard.next();
    }

    const afterAnswerStep = new Composer();

    codeDefineAfterAnswer(afterAnswerStep, sample);

    const wizard = new WizardScene(name, beforeAnswerStep, afterAnswerStep);

    botManaging.pushWizard(wizard);
}