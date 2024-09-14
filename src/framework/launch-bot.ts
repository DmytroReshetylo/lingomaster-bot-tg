import { Scenes, session } from 'telegraf';
import { AppBotModule } from '../app/app.module';
import { bot } from './bot-connect';
import { botManaging } from './classes/bot-managing.class';
import { QueueCommandsConstant } from './constants/queue-commands.constant';
import { QueueStagesConstant } from './constants/queue-stages.constant';

export function LaunchBot() {
    new AppBotModule();

    for(const launch of QueueStagesConstant.reverse()) {
        launch();
    }

    const stage = new Scenes.Stage<any>(botManaging.getWizards());

    bot.use(session());
    bot.use(stage.middleware());

    for(const launch of QueueCommandsConstant.reverse()) {
        launch();
    }

    bot.launch();

    console.log('BOT STARTED!');
}