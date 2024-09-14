import { Container } from 'inversify';
import { TypeProvider } from '../enums/type-provider.enum';
import { Constructor } from '../types/contructor.type';
import { FullDependency } from '../types/full-dependency.type';
import { Provider } from '../types/provider.type';

export function ProvideDependencies(container: Container, target: Constructor<any>, dependencies: Provider<any, any>[]) {
    for(const dependency of dependencies) {
        const data = (!dependency.constructor ? dependency : {
            token: dependency,
            type: TypeProvider.USECLASS,
            provider: dependency
        }) as FullDependency<any, any>;

        switch (data.type) {
            case TypeProvider.USEVALUE: {
                container.bind(data.token).toConstantValue(data.provider);
                break;
            }
            case TypeProvider.USEFACTORY: {
                container.bind(data.token).toConstantValue((data.provider as any).call(container.get));
                break;
            }
            case TypeProvider.USECLASS: {
                container.bind(data.token).to(data.provider as any);
                break;
            }
        }
    }

    Reflect.defineMetadata('container', container, target);
}