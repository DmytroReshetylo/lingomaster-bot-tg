import { Container, injectable } from 'inversify';
import { botManaging } from '../classes/bot-managing';
import { QueueStagesConstant } from '../constants/queue-stages.constant';
import { Constructor } from '../types/contructor.type';
import { SceneConfig } from '../types/scene-config.type';
import { LaunchWizard } from '../utils/launch-wizard.util';
import { ProvideDependencies } from '../utils/provide-dependencies.util';
import { randomSymbols } from '../utils/random-symbols';
import 'reflect-metadata';

export function CreateScene(config: SceneConfig) {
    return function (target: Constructor<any>) {
        injectable()(target);

        const container = new Container();

        ProvideDependencies(container, target,[...config.providers, ...config.composers]);

        QueueStagesConstant.push(() => {
            const nameComposers = config.composers.map(composer => {
               const name = randomSymbols(12);

                LaunchWizard(container, name, composer);

                return name;
            });

            botManaging.registerScene(target, config.name, nameComposers);
        });
    }
}