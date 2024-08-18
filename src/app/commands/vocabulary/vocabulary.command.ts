import { TelegramContext } from '../../../core/ctx.class';
import { Command } from '../../../core/types';
import { Apply, CreateCommand } from '../../../core';
import { IsRegisteredMiddleware } from '../../shared/middlewares';

@CreateCommand('vocabulary')
export class VocabularyCommand implements Command {

    @Apply({middlewares: [IsRegisteredMiddleware], possibleErrors: []})
    command(ctx: TelegramContext) {
        ctx.scene.enterScene('vocabulary-choose-action-scene');
    }
}