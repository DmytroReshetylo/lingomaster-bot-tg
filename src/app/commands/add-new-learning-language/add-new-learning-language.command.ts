import { CreateCommand } from '../../../core';
import { TelegramContext } from '../../../core/ctx.class';
import { Command } from '../../../core/decorators/create-command/types';

@CreateCommand('add_new_learning_language')
export class AddNewLearningLanguageCommand implements Command {
    command(ctx: TelegramContext) {
        ctx.scene.enterScene('add-new-learning-language-scene');
    }
}