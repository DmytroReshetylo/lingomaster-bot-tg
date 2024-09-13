import { Scenes, session } from 'telegraf';
import { AppBotModule } from '../app/app.module';
import { bot } from './bot-connect';
import { botManaging } from './classes/bot-managing';
import { QueueCommandsConstant } from './constants/queue-commands.constant';
import { QueueStagesConstant } from './constants/queue-stages.constant';

export function LaunchBot() {
    new AppBotModule();

    for(const launch of [...QueueStagesConstant.reverse(), ...QueueCommandsConstant.reverse()]) {
        launch();
    }

    const stage = new Scenes.Stage<any>(botManaging.getStages());

    bot.use(session());
    bot.use(stage.middleware());

    bot.launch();

    console.log('BOT STARTED!');
}