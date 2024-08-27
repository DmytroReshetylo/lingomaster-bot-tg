import { TelegramContext } from '../../../core/ctx.class';
import { Apply, CreateCommand } from '../../../core';
import { Command } from '../../../core/decorators/create-command/types';
import { IsRegisteredMiddleware } from '../../shared/middlewares';

@CreateCommand('vocabulary')
export class VocabularyCommand implements Command {

    @Apply({middlewares: [IsRegisteredMiddleware], possibleErrors: []})
    command(ctx: TelegramContext) {
        ctx.scene.enterScene('vocabulary-choose-action-scene');
    }
}