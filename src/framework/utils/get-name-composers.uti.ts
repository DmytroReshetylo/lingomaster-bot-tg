import { ComposerStructure } from '../types/composer-structure.type';
import { Constructor } from '../types/contructor.type';
import 'reflect-metadata';

export function GetNameComposers(composers: Constructor<ComposerStructure>[]) {
    return composers.map(composer => {
        return Reflect.getMetadata('wizard-name', composer) as string;
    });
}