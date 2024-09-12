import { ComposerStructure } from './composer-structure.type';
import { Constructor } from './contructor.type';

export type ComposerConfig = {
    name: string,
    info: Constructor<ComposerStructure>
}