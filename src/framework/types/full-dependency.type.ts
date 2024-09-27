import { TypeProvider } from '../enums/type-provider.enum';
import { Constructor } from './contructor.type';

type ProviderMapping<T> = {
    [TypeProvider.useValue]: any;
    [TypeProvider.useClass]: Constructor<any>;
    [TypeProvider.useFactory]: (injector: Function) => T;
};

export type FullDependency<TYPE extends keyof ProviderMapping<T>, T> = {
    token: any;
    type: TYPE;
    provider: ProviderMapping<T>[TYPE];
};