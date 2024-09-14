import { Composer } from 'telegraf';
import { TriggerStructure } from './trigger-structure.type';

export type CodeDefineAfterInput = (afterInputComposer: Composer<any>, afterInput: TriggerStructure['afterInput']) => void;