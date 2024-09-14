import { Constructor } from './contructor.type';
import { FullDependency } from './full-dependency.type';

export type Provider<TYPE extends 'useValue' | 'useClass' | 'useFactory', T> = FullDependency<TYPE, T> | Constructor<any>;