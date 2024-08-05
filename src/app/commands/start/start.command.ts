import { Apply, CreateCommand } from '../../../core';
import { Command, Ctx } from '../../../core/types';
import { IsNotBotAndNotGroupMiddleware, IsNotRegisteredMiddleware } from '../../shared/middlewares';
@CreateCommand('start')
export class StartCommand implements Command {
    @Apply({middlewares: [IsNotBotAndNotGroupMiddleware, IsNotRegisteredMiddleware], possibleErrors: []})
    command(ctx: Ctx): void {
        ctx.scene.enter('sign-up-scene');
    }
}