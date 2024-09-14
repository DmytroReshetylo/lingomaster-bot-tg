import { ComposerStructure } from './composer-structure.type';
import { Constructor } from './contructor.type';

export type SceneConfig = {
    name: string;
    providers: any[];
    composers: Constructor<ComposerStructure>[];
}