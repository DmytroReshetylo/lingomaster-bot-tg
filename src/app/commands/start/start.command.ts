import { inject } from 'inversify';
import { TelegramContext } from '../../../framework/classes/ctx.class';
import { CreateCommand } from '../../../framework/decorators/create-command';
import { CodeStructure } from '../../../framework/types/composer-structure.type';
import { TranslateProvider } from '../../shared/providers/translate.provider';

@CreateCommand({
    trigger: 'start',
    providers: []
})
export class StartCommand implements CodeStructure {
    constructor(
        @inject(TranslateProvider) private readonly translator: TranslateProvider
    ) {}

    code(ctx: TelegramContext) {
        ctx.reply('1');

        console.log(this);
    }

    protect() {
        return {
            middlewares: [],
            errors: []
        }
    }
}