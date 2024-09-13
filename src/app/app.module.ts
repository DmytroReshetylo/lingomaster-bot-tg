import { CreateModule } from '../framework/decorators/create-module';
import { StartModule } from './commands/start/start.module';
import { Languages } from './shared/enums/languages.enum';
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