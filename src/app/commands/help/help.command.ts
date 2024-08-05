import { Apply, CreateCommand } from '../../../core';
import { Languages } from '../../../core/language-interface/enums';
import { translate } from '../../../core/language-interface/translate.alghoritm';
import { Command, Ctx } from '../../../core/types';
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
    command(ctx: Ctx): void {
        const s = commandList.reduce((acc: string, command) => {
            return `${acc}${command.name} - ${translate(command.description, ctx.session.user ? ctx.session.user.interfaceLanguage : Languages.en)}\n`;
        }, '');

        ctx.reply(s, getNavigationButtons());
    }
}