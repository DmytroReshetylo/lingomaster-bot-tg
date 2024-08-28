import { HelpCommand } from '../app/commands/help/help.command';
import { SelectInterfaceLanguageScene } from '../app/commands/select-interface-language/scenes/select-interface-language.scene';
import { SelectInterfaceLanguageCommand } from '../app/commands/select-interface-language/select-interface-language.command';
import { SignUpScene } from '../app/commands/start/scenes/sign-up.scene';
import { StartCommand } from '../app/commands/start/start.command';
import { VocabularyAddFlashcardsScene, VocabularyChangeFlashcardScene, VocabularyChooseActionScene, VocabularyRemoveFlashcardsScene, VocabularySeeFlashcardsScene, VocabularyStudyFlashcardsScene, VocabularyStudyNewLanguageScene } from '../app/commands/vocabulary/scenes';
import { VocabularyCommand } from '../app/commands/vocabulary/vocabulary.command';
import { userService } from '../app/services/database/user/user.service';
import { vocabularyService } from '../app/services/database/vocabulary/vocabulary.service';
import { getNavigationButtons } from '../app/shared/utils';
import { TelegramContext } from '../core/ctx.class';
import { Languages } from '../core/language-interface/enums';
import { findInJson, translate } from '../core/language-interface/translate.alghoritm';

export const startBotConfig = {
    token: process.env.telegram as string,

    commands: [
        StartCommand,
        HelpCommand,
        VocabularyCommand,
        SelectInterfaceLanguageCommand
    ],

    scenes: [
        SignUpScene,
        SelectInterfaceLanguageScene,
        VocabularyChooseActionScene,
        VocabularyStudyNewLanguageScene,
        VocabularyAddFlashcardsScene,
        VocabularyRemoveFlashcardsScene,
        VocabularyChangeFlashcardScene,
        VocabularySeeFlashcardsScene,
        VocabularyStudyFlashcardsScene
    ],

    commandConfiguration: async(ctx: TelegramContext) => {
        if(!ctx.session['user']) {
            ctx.session['idTelegram'] = String(ctx.message.from.id);

            ctx.session['user'] = await userService.getEntity({idTelegram: ctx.session['idTelegram']});
            ctx.session['vocabularies'] = await vocabularyService.getEntities({user: ctx.session['user']}) || [];

            console.log(ctx.session['user'] );
        }
    },

    messageCommandNotFound: (ctx: TelegramContext) => ctx.reply(
        translate('INFO.COMMAND_DONT_EXIST', ctx.session['user'] ? ctx.session['user'].interfaceLanguage : Languages.en)
    ),

    transformSelectBigButtonData: (data: string, ctx: TelegramContext) => findInJson(data, ctx.session['user'] ? ctx.session['user'].interfaceLanguage : Languages.en),

    transformApplyDecoratorMessage: (message: string, ctx: TelegramContext) => translate(
        message,
        ctx.session['user'] ? ctx.session['user'].interfaceLanguage : Languages.en
    ),

    unknownCommandMessage: (ctx: TelegramContext) => translate(
        'ERRORS.UNKNOWN_ERROR',
        ctx.session['user'] ? ctx.session['user'].interfaceLanguage : Languages.en
    ),

    signalCancel: (data: string, ctx: TelegramContext) => {
        return data === 'BUTTONS.CANCEL';
    },

    messageCancel: (ctx: TelegramContext) => ctx.reply(translate('INFO.CANCELLED', ctx.session['user'].interfaceLanguage), getNavigationButtons())
}