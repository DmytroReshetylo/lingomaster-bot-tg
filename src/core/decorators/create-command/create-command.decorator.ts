import { bot } from '../../start.alghoritm';
import { Ctx } from '../../types';
import { UserService } from '../../../app/services/database/user/user.service';
import { VocabularyService } from '../../../app/services/database/vocabulary/vocabulary.service';

const listCommands: ((globalConfiguration: (ctx: Ctx) => void) => void)[] = [];

export function CreateCommand(commandName: string) {
    return function (target: any) {
        const command = Object.getOwnPropertyNames(target.prototype).find((method) => method === 'command');

        if(!command) {
            throw Error('The class has no command method');
        }

        const commandMethod = Object.getOwnPropertyDescriptor(target.prototype, command!)!.value as (ctx: Ctx) => void;

        listCommands.push((globalConfiguration: (ctx: Ctx) => void) => {
            bot.command(commandName, async(ctx: Ctx) => {

                await globalConfiguration(ctx);

                commandMethod(ctx);
            });
        });

        return target;
    }
}

export function registerCommands(globalConfiguration: (ctx: Ctx) => void) {
    listCommands.forEach((command) => {
        command(globalConfiguration);
    });
}