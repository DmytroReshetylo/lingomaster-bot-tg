import { Container } from 'inversify';
import { Constructor } from '../types/contructor.type';

export function LaunchTriggersAndScenes(container: Container, dependencies: Constructor<any>[]) {
    for(const dependency of dependencies) {
        const sample = container.get(dependency);

        if(sample.code) {
            sample.code.call(sample);
        }
    }
}