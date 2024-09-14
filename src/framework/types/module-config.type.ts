import { Constructor } from './contructor.type';
import { Provider } from './provider.type';
import { TriggerStructure } from './trigger-structure.type';

export type ModuleConfig = {
    modules: Constructor<any>[];
    triggers: Constructor<TriggerStructure>[];
    scenes: Constructor<any>[];
    providers: Provider<any, any>[];
}