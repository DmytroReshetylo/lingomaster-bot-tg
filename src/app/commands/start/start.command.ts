import { Apply, CreateCommand } from '../../../core';
import { TelegramContext } from '../../../core/ctx.class';
import { Command } from '../../../core/decorators/create-command/types';
import { IsNotBotAndNotGroupMiddleware, IsNotRegisteredMiddleware } from '../../shared/middlewares';

@CreateCommand('start')
export class StartCommand implements Command {
    @Apply({middlewares: [IsNotBotAndNotGroupMiddleware, IsNotRegisteredMiddleware], possibleErrors: []})
    command(ctx: TelegramContext): void {
        ctx.scene.enterScene('sign-up-scene');
    }
}