import { AddNewLearningLanguageCommand } from '../app/commands/add-new-learning-language/add-new-learning-language.command';
import { AddNewLearningLanguageScene } from '../app/commands/add-new-learning-language/scenes/add-new-learning-language.scene';
import { HelpCommand } from '../app/commands/help/help.command';
import { SelectInterfaceLanguageScene } from '../app/commands/select-interface-language/scenes/select-interface-language.scene';
import { SelectInterfaceLanguageCommand } from '../app/commands/select-interface-language/select-interface-language.command';
import { SignUpScene } from '../app/commands/start/scenes/sign-up.scene';
import { StartCommand } from '../app/commands/start/start.command';
import { VocabularyAddFlashcardsScene, VocabularyChangeFlashcardScene, VocabularyChooseActionScene, VocabularyRemoveFlashcardsScene, VocabularySeeFlashcardsScene, VocabularyStudyFlashcardsScene } from '../app/commands/vocabulary/scenes';
import { VocabularyCommand } from '../app/commands/vocabulary/vocabulary.command';
import { EntityNames } from '../app/services/database/entities/entity-names';
import { UpdateDataSessionSubscribers } from '../app/shared/session/update-data-session.util';
import { getNavigationButtons } from '../app/shared/utils';
import { TelegramContext } from '../core/ctx.class';
import { Languages } from '../core/language-interface/enums';
import { findInJson, translate } from '../core/language-interface/translate.alghoritm';

export const startBotConfig = {
    token: process.env.telegram as string,

    commands: [
        StartCommand,
        HelpCommand,
        AddNewLearningLanguageCommand,
        VocabularyCommand,
        SelectInterfaceLanguageCommand
    ],

    scenes: [
        SignUpScene,
        SelectInterfaceLanguageScene,
        AddNewLearningLanguageScene,
        VocabularyChooseActionScene,
        VocabularyAddFlashcardsScene,
        VocabularyRemoveFlashcardsScene,
        VocabularyChangeFlashcardScene,
        VocabularySeeFlashcardsScene,
        VocabularyStudyFlashcardsScene
    ],

    commandConfiguration: async(ctx: TelegramContext) => {
        if(!ctx.session[EntityNames.User]) {
            ctx.session['idTelegram'] = String(ctx.message.from.id);

            await UpdateDataSessionSubscribers(ctx);
        }
    },

    messageCommandNotFound: (ctx: TelegramContext) => ctx.reply(
        translate('INFO.COMMAND_DONT_EXIST', ctx.session[EntityNames.User] ? ctx.session[EntityNames.User].interfaceLanguage : Languages.en)
    ),

    transformSelectBigButtonData: (data: string, ctx: TelegramContext) => findInJson(data, ctx.session[EntityNames.User] ? ctx.session[EntityNames.User].interfaceLanguage : Languages.en),

    transformApplyDecoratorMessage: (message: string, ctx: TelegramContext) => translate(
        message,
        ctx.session[EntityNames.User] ? ctx.session[EntityNames.User].interfaceLanguage : Languages.en
    ),

    unknownCommandMessage: (ctx: TelegramContext) => translate(
        'ERRORS.UNKNOWN_ERROR',
        ctx.session[EntityNames.User] ? ctx.session[EntityNames.User].interfaceLanguage : Languages.en
    ),

    signalCancel: (data: string, ctx: TelegramContext) => {
        return data === 'BUTTONS.CANCEL';
    },

    messageCancel: (ctx: TelegramContext) => ctx.reply(translate('INFO.CANCELLED', ctx.session[EntityNames.User].interfaceLanguage), getNavigationButtons())
}