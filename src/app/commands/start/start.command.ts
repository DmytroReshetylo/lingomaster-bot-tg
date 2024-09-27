import { inject } from 'inversify';
import { TelegramContext } from '../../../framework/classes/ctx.class';
import { CreateCommand } from '../../../framework/decorators/create-command';
import { TriggerStructure } from '../../../framework/types/trigger-structure.type';
import { TranslateProvider } from '../../core/providers/translate.provider';

@CreateCommand({
    trigger: 'start',
    providers: []
})
export class StartCommand implements TriggerStructure {
    constructor(
        @inject(TranslateProvider) private readonly translator: TranslateProvider
    ) {}

    code(ctx: TelegramContext) {
        ctx.reply('1');

        ctx.scene.enterScene('sign-up-scene');
    }

    protect() {
        return {
            middlewares: [],
            errors: []
        }
    }
}