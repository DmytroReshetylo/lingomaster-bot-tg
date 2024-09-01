import { Apply, CreateCommand } from '../../../core';
import { TelegramContext } from '../../../core/ctx.class';
import { Command } from '../../../core/decorators/create-command/types';
import { Languages } from '../../../core/language-interface/enums';
import { translate } from '../../../core/language-interface/translate.alghoritm';
import { EntityNames } from '../../services/database/entities/entity-names';
import { IsNotBotAndNotGroupMiddleware } from '../../shared/middlewares';
import { getNavigationButtons } from '../../shared/utils';

const commandList: {name: string, description: string}[] = [
    {
        name: '/start',
        description: 'HELP.START'
    },
    {
        name: '/interface',
        description: 'HELP.INTERFACE'
    },
    {
        name: '/vocabulary',
        description: 'HELP.VOCABULARY'
    }
]


@CreateCommand('help')
export class HelpCommand implements Command {
    @Apply({middlewares: [IsNotBotAndNotGroupMiddleware], possibleErrors: []})
    command(ctx: TelegramContext): void {
        const s = commandList.reduce((acc: string, command) => {
            return `${acc}${command.name} - ${translate(command.description, ctx.session[EntityNames.User] ? ctx.session[EntityNames.User].interfaceLanguage : Languages.en)}\n`;
        }, '');


        ctx.reply(s, getNavigationButtons());
    }
}