import { injectable } from 'inversify';
import { CodeDefineAfterAnswer } from '../types/code-define-after-answer.type';
import { Constructor } from '../types/contructor.type';
import 'reflect-metadata';

export function CreateComposer<T>(target: Constructor<T>, codeDefineAfterAnswer: CodeDefineAfterAnswer<T>) {
    injectable()(target);

    Reflect.defineMetadata('code-define-after-answer', codeDefineAfterAnswer, target);
}