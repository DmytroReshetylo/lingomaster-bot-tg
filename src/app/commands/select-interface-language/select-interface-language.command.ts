import { Apply, CreateCommand } from '../../../core';
import { Command } from '../../../core/decorators/create-command/types';
import { Ctx } from '../../../core/types';
import { IsNotBotAndNotGroupMiddleware, IsRegisteredMiddleware } from '../../shared/middlewares';

@CreateCommand('interface')
export class SelectInterfaceLanguageCommand implements Command {

    @Apply({middlewares: [IsNotBotAndNotGroupMiddleware, IsRegisteredMiddleware], possibleErrors: []})
    command(ctx: Ctx) {
        ctx.scene.enter('select-interface-language-scene');
    }

}