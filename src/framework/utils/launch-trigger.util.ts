import { Container } from 'inversify';
import { TelegramContext } from '../classes/ctx.class';
import { Constructor } from '../types/contructor.type';
import { TriggerStructure } from '../types/trigger-structure.type';

export function LaunchTrigger(container: Container, trigger: Constructor<TriggerStructure>, codeDefineTrigger: (code: (ctx: TelegramContext) => void) => void) {
    const sample = container.get(trigger);

    codeDefineTrigger(sample.code.bind(sample));
}