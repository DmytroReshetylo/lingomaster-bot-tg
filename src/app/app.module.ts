import { CreateModule } from '../framework/decorators/create-module';
import { Languages } from '../framework/enums/languages.enum';
import { StartModule } from './commands/start/start.module';
import { TranslateProvider } from './shared/providers/translate.provider';
import 'reflect-metadata';

@CreateModule({
    modules: [
        StartModule
    ],
    triggers: [],
    scenes: [],
    providers: [
        TranslateProvider.forRoot([Languages.en, Languages.uk])
    ]
})
export class AppBotModule {}