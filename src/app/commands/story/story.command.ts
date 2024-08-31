import { CreateCommand } from '../../../core';
import { TelegramContext } from '../../../core/ctx.class';
import { Command } from '../../../core/decorators/create-command/types';

@CreateCommand('texts')
export class StoryCommand implements Command {
    command(ctx: TelegramContext): void {
    }

}