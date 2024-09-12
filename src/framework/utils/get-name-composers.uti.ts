import { WizardScene } from 'telegraf/scenes';
import { CodeStructure } from '../types/composer-structure.type';
import { Constructor } from '../types/contructor.type';
import 'reflect-metadata';

export function GetNameComposers(composers: Constructor<CodeStructure>[]) {
    return composers.map(composer => {
        const wizard = Reflect.getMetadata('wizard', composer) as WizardScene<any>;

        return wizard.id;
    });
}