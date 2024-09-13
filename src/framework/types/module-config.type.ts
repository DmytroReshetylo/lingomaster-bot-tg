import { Constructor } from './contructor.type';
import { TriggerStructure } from './trigger-structure.type';

export type ModuleConfig = {
    modules: Constructor<any>[];
    triggers: Constructor<TriggerStructure>[];
    scenes: Constructor<any>[];
    providers: any[];
}