import { CodeStructure } from './composer-structure.type';
import { Constructor } from './contructor.type';

export type ModuleConfig = {
    modules: Constructor<any>[];
    triggers: Constructor<CodeStructure>[];
    scenes: Constructor<any>[];
    providers: any[];
}