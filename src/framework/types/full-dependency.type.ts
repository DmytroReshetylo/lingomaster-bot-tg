import { TypeProvider } from '../enums/type-provider.enum';
import { Constructor } from './contructor.type';

type ProviderMapping<T> = {
    [TypeProvider.USEVALUE]: any;
    [TypeProvider.USECLASS]: Constructor<any>;
    [TypeProvider.USEFACTORY]: (injector: Function) => T;
};

export type FullDependency<TYPE extends keyof ProviderMapping<T>, T> = {
    token: any;
    type: TYPE;
    provider: ProviderMapping<TYPE>;
};