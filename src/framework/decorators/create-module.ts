import { Container, injectable } from 'inversify';
import { Constructor } from '../types/contructor.type';
import { ModuleConfig } from '../types/module-config.type';
import { ProvideDependencies } from '../utils/provide-dependencies.util';
import { SetContainerParent } from '../utils/set-container-parent.util';
import 'reflect-metadata';

export function CreateModule(config: ModuleConfig) {
    return function (target: Constructor<any>) {
        injectable()(target);

        const container = new Container();

        ProvideDependencies(container, target, config.providers);

        SetContainerParent(container, [...config.modules, ...config.scenes, ...config.triggers]);
    }
}