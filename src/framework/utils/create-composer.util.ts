import { injectable } from 'inversify';
import { CodeDefineAfterInput } from '../types/code-define-after-input.type';
import { ComposerStructure } from '../types/composer-structure.type';
import { Constructor } from '../types/contructor.type';
import 'reflect-metadata';

export function CreateComposer(target: Constructor<ComposerStructure>, codeDefineAfterInput: CodeDefineAfterInput) {
    injectable()(target);

    Reflect.defineMetadata('code-define-after-input', codeDefineAfterInput, target);
}