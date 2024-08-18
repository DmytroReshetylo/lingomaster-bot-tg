import { TelegramContext } from '../../ctx.class';
import { bot } from '../../start.alghoritm';

const listCommands: ((globalConfiguration: (ctx: TelegramContext) => void) => void)[] = [];

export function CreateCommand(commandName: string) {
    return function (target: any) {
        const command = Object.getOwnPropertyNames(target.prototype).find((method) => method === 'command');

        if(!command) {
            throw Error('The class has no command method');
        }

        const commandMethod = Object.getOwnPropertyDescriptor(target.prototype, command!)!.value as (ctx: TelegramContext) => void;

        listCommands.push((globalConfiguration: (ctx: TelegramContext) => void) => {
            bot.command(commandName, async(ctx: any) => {
                const tgCtx = new TelegramContext(ctx);

                await globalConfiguration(tgCtx);

                commandMethod(tgCtx);
            });
        });

        return target;
    }
}

export function registerCommands(globalConfiguration: (ctx: TelegramContext) => void) {
    listCommands.forEach((command) => {
        command(globalConfiguration);
    });
}