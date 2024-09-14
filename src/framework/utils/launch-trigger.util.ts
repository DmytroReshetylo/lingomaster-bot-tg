import { Container } from 'inversify';
import { CodeDefineTrigger } from '../types/code-define-trigger.type';
import { Constructor } from '../types/contructor.type';
import { TriggerStructure } from '../types/trigger-structure.type';

export function LaunchTrigger(container: Container, trigger: Constructor<TriggerStructure>, codeDefineTrigger: CodeDefineTrigger) {
    const sample = container.get(trigger);

    codeDefineTrigger(sample.code.bind(sample));
}