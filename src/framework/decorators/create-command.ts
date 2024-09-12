import { Container, injectable } from 'inversify';
import { bot } from '../bot-connect';
import { QueueDependenciesConstant } from '../constants/queue-dependencies.constant';
import { CodeStructure } from '../types/composer-structure.type';
import { Constructor } from '../types/contructor.type';
import { TriggerConfig } from '../types/trigger-config.type';
import { ApplyCodeWithProtect } from '../utils/apply-code-with-protect.uril';
import { LaunchTriggersAndScenes } from '../utils/launch-triggers-and-scenes.util';
import { ProvideDependencies } from '../utils/provide-dependencies.util';
import 'reflect-metadata';

export function CreateCommand(config: TriggerConfig) {
    return function (target: Constructor<CodeStructure>) {
        injectable()(target);

        const container = new Container();

        ProvideDependencies(container, target, [target, ...config.providers]);

        const code =  Object.getOwnPropertyDescriptor(target.prototype, 'code')!.value as CodeStructure['code'];

        const protect = Object.getOwnPropertyDescriptor(target.prototype, 'protect')!.value as CodeStructure['protect'];

        Object.defineProperty(target.prototype, 'code', {
            value: function()  {
                bot.command(config.trigger, async(ctx: any) => {
                    await ApplyCodeWithProtect(ctx, code.bind(this), protect());
                });
            }
        });

        QueueDependenciesConstant.push(() => LaunchTriggersAndScenes(container, [target]));
    }
}