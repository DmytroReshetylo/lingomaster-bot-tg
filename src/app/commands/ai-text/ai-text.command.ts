import { CreateCommand } from '../../../core';
import { TelegramContext } from '../../../core/ctx.class';
import { Command } from '../../../core/decorators/create-command/types';

@CreateCommand('texts')
export class AiTextCommand implements Command {

    command(ctx: TelegramContext) {

    }

}