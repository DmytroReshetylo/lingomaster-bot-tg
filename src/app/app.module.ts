import { CreateModule } from '../framework/decorators/create-module';
import { StartModule } from './commands/start/start.module';
import { Languages } from './core/enums/languages.enum';
import { DbConnectionProvider } from './core/providers/db-connection.provider';
import { TranslateProvider } from './core/providers/translate.provider';
import 'reflect-metadata';

@CreateModule({
    modules: [
        StartModule
    ],
    triggers: [],
    scenes: [],
    providers: [
        TranslateProvider.forRoot([Languages.ENGLISH, Languages.UKRAINIAN]),
        DbConnectionProvider
    ]
})
export class AppBotModule {}