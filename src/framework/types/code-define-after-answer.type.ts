import { Composer } from 'telegraf';

export type CodeDefineAfterAnswer<T> = (afterAnswerComposer: Composer<any>, sample: T) => void;