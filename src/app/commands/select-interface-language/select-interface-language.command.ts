import { Apply, CreateCommand } from '../../../core';
import { TelegramContext } from '../../../core/ctx.class';
import { Command } from '../../../core/decorators/create-command/types';
import { IsNotBotAndNotGroupMiddleware, IsRegisteredMiddleware } from '../../shared/middlewares';

@CreateCommand('interface')
export class SelectInterfaceLanguageCommand implements Command {

    @Apply({middlewares: [IsNotBotAndNotGroupMiddleware, IsRegisteredMiddleware], possibleErrors: []})
    command(ctx: TelegramContext) {
        ctx.scene.enterScene('select-interface-language-scene');
    }

}