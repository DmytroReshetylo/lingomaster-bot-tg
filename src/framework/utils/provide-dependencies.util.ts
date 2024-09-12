import { Container } from 'inversify';
import { Constructor } from '../types/contructor.type';

export function ProvideDependencies(container: Container, target: Constructor<any>, dependencies: any[]) {
    for(const dependency of dependencies) {
        container.bind(dependency).toSelf();
    }

    Reflect.defineMetadata('container', container, target);
}