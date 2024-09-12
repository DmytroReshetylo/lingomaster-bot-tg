import { Container, injectable } from 'inversify';
import { botManaging } from '../classes/bot-managing';
import { Constructor } from '../types/contructor.type';
import { SceneConfig } from '../types/scene-config.type';
import { GetNameComposers } from '../utils/get-name-composers.uti';
import { ProvideDependencies } from '../utils/provide-dependencies.util';
import 'reflect-metadata';

export function CreateScene(config: SceneConfig) {
    return function (target: Constructor<any>) {
        injectable()(target);

        const container = new Container();

        ProvideDependencies(container, target,[...config.providers, ...config.composers]);

        //QueueDependencies.push(() => LaunchTriggersAndScenes(container, config.composers));

        const nameComposers = GetNameComposers(config.composers);

        botManaging.registerScene(target, config.name, nameComposers);
    }
}