import { Container, injectable } from 'inversify';
import { bot } from '../bot-connect';
import { TelegramContext } from '../classes/ctx.class';
import { QueueCommandsConstant } from '../constants/queue-commands.constant';
import { Constructor } from '../types/contructor.type';
import { TriggerConfig } from '../types/trigger-config.type';
import { TriggerStructure } from '../types/trigger-structure.type';
import { LaunchTrigger } from '../utils/launch-trigger.util';
import { ProvideDependencies } from '../utils/provide-dependencies.util';
import 'reflect-metadata';

export function CreateCommand(config: TriggerConfig) {
    return function (target: Constructor<TriggerStructure>) {
        injectable()(target);

        const container = new Container();

        ProvideDependencies(container, target, [target, ...config.providers]);

        QueueCommandsConstant.push(() => LaunchTrigger(container, target, (code) => {
            bot.command(config.trigger, async(ctx: any) => {
                code(new TelegramContext(ctx));
            });
        }));
    }
}