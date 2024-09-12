import { Container } from 'inversify';
import { Constructor } from '../types/contructor.type';

export function SetContainerParent(parent: Container, injectableClasses: Constructor<any>[]) {
    for(const injectableClass of injectableClasses) {
        const child = Reflect.getMetadata('container', injectableClass) as Container;

        child.parent = parent;

        Reflect.defineMetadata('container', child, injectableClass);
    }
}