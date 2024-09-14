import { ComposerStructure } from './composer-structure.type';
import { Constructor } from './contructor.type';
import { Provider } from './provider.type';

export type SceneConfig = {
    name: string;
    providers: Provider<any, any>[];
    composers: Constructor<ComposerStructure>[];
}