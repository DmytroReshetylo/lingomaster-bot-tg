import { TypeProvider } from '../enums/type-provider.enum';
import { Constructor } from './contructor.type';
import { FullDependency } from './full-dependency.type';

export type Provider<TYPE extends TypeProvider, T> = FullDependency<TYPE, T> | Constructor<any>;