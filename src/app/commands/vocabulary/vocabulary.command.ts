import { Command, Ctx } from '../../../core/types';
import { Apply, CreateCommand } from '../../../core';
import { IsRegisteredMiddleware } from '../../shared/middlewares';

@CreateCommand('vocabulary')
export class VocabularyCommand implements Command {

    @Apply({middlewares: [IsRegisteredMiddleware], possibleErrors: []})
    command(ctx: Ctx) {
        ctx.scene.enter('vocabulary-choose-action-scene');
    }
}