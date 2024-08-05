import { Ctx } from '../../../types';

export type Scene = {
    start: (ctx: Ctx) => void;
}