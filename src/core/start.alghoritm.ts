import { Context, Scenes, session, Telegraf } from 'telegraf';
import { applyDecoratorConfig } from './decorators/apply/configs';
import { TransformApplyDecoratorMessage, UnknownCommandMessage } from './decorators/apply/configs/types';
import { registerCommands } from './decorators/create-command/create-command.decorator';
import { buttonConfig } from './decorators/scene/composers/configs';
import { MessageCancel, SignalCancel, TransformSelectBigButton } from './decorators/scene/composers/configs/types';
import { Scene } from './decorators/scene/types';
import { registerScenes } from './decorators/scene/create-scene.decorator';
import { registerNotFoundCommand } from './decorators/create-command/not-found';
import { Command } from './types';

type Constructor<T> = new (...args: any[]) => T;

export let bot!: Telegraf<Context>;

export async function start(config: {
    token: string,
    commands: (Constructor<Command>)[],
    scenes: (Constructor<Scene>)[],
    commandConfiguration: (ctx: any) => void,
    messageCommandNotFound: (ctx: any) => void;
    transformSelectBigButtonData: TransformSelectBigButton,
    transformApplyDecoratorMessage: TransformApplyDecoratorMessage,
    unknownCommandMessage: UnknownCommandMessage,
    signalCancel: SignalCancel,
    messageCancel: MessageCancel
}) {
    bot = new Telegraf(config.token);

    buttonConfig.setConfiguration(config.signalCancel, config.messageCancel, config.transformSelectBigButtonData)
    applyDecoratorConfig.setConfiguration(config.transformApplyDecoratorMessage, config.unknownCommandMessage)

    for(const constructor of [...config.commands, ...config.scenes]) {
        new constructor();
    }

    const initScenes = registerScenes();

    const stage = new Scenes.Stage<any>(initScenes);

    bot.use(session());
    bot.use(stage.middleware());

    registerCommands(config.commandConfiguration);

    registerNotFoundCommand(config.messageCommandNotFound);

    bot.launch();

    console.log('BOT STARTED!');
}