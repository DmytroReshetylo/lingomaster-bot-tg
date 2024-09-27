import { Container, injectable } from 'inversify';
import { botManaging } from '../classes/bot-managing.class';
import { QueueStagesConstant } from '../constants/queue-stages.constant';
import { ComposerStructure } from '../types/composer-structure.type';
import { Constructor } from '../types/contructor.type';
import { SceneConfig } from '../types/scene-config.type';
import { CreateWizard } from '../utils/create-wizard.util';
import { ProvideDependencies } from '../utils/provide-dependencies.util';
import { randomSymbols } from '../utils/random-symbols';
import 'reflect-metadata';

export function CreateScene(config: SceneConfig) {
    return function (target: Constructor<any>) {
        injectable()(target);

        const container = new Container();

        const uniqueComposers = new Set(config.composers);

        ProvideDependencies(container, target,[...config.providers, ...uniqueComposers]);

        QueueStagesConstant.push(() => {
            const composersWithName = new Map<Constructor<ComposerStructure>, string>();

            for(const composer of uniqueComposers) {
                const name = randomSymbols(12);

                CreateWizard(container, name, composer);

                composersWithName.set(composer, name);
            }

            const nameComposers = config.composers.map(composer => composersWithName.get(composer)!);

            botManaging.registerScene(config.name, nameComposers);
        });
    }
}