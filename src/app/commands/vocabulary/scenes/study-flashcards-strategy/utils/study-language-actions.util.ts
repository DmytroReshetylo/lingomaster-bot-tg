import { TelegramContext } from '../../../../../../core/ctx.class';
import { translate } from '../../../../../../core/language-interface/translate.alghoritm';
import { createBigButtonKeyboard } from '../../../../../../core/telegram-utils';
import { ShowFlashcardFormatWithOptions, ShowFlashcardFormatWithoutPhotoAndOptions, ShowFlashcardFormatWithPhoto, ShowFlashcardFormatWithPhotoAndOptions } from './show-flashcard-format-list';

function getQuestion(ctx: TelegramContext) {
    return `${translate('VOCABULARY.STUDY_LANGUAGE.STUDYING.ASK', ctx.session['user'].interfaceLanguage)} ${ctx.scene.states.flashcard.frontSide}`;
}

export const studyLanguageActions: any = {
    'VOCABULARY.STUDY_LANGUAGE.MODELS.WITHOUT_PHOTO_AND_OPTIONS': {
        showNextFlashcard: ShowFlashcardFormatWithoutPhotoAndOptions,
        sendMessage: async(ctx: TelegramContext) => {
            const sentMessage = await ctx.reply(
                getQuestion(ctx),
                createBigButtonKeyboard(ctx.scene.states.flashcard.answerOptions || [])
            );

            ctx.scene.states.queueOnDelete.push(sentMessage.message_id);
        }
    },
    'VOCABULARY.STUDY_LANGUAGE.MODELS.WITH_OPTIONS': {
        showNextFlashcard: ShowFlashcardFormatWithOptions,
        sendMessage: async(ctx: TelegramContext) => {
            const sentMessage = await ctx.reply(
                getQuestion(ctx),
                createBigButtonKeyboard(ctx.scene.states.flashcard.answerOptions || [])
            );

            ctx.scene.states.queueOnDelete.push(sentMessage.message_id);
        }
    },
    'VOCABULARY.STUDY_LANGUAGE.MODELS.WITH_PHOTO': {
        showNextFlashcard: ShowFlashcardFormatWithPhoto,
        sendMessage: async(ctx: TelegramContext) => {
            if(!ctx.scene.states.flashcard.photo) {
                studyLanguageActions['VOCABULARY.STUDY_LANGUAGE.MODELS.WITHOUT_PHOTO_AND_OPTIONS'].sendMessage(ctx);

                return;
            }

            const sentMessage = await ctx.sendPhoto(
                ctx.scene.states.flashcard.photo,
                getQuestion(ctx),
                createBigButtonKeyboard(ctx.scene.states.flashcard.answerOptions || [])
            );

            ctx.scene.states.queueOnDelete.push(sentMessage.message_id);
        }
    },
    'VOCABULARY.STUDY_LANGUAGE.MODELS.WITH_PHOTO_AND_OPTIONS': {
        showNextFlashcard: ShowFlashcardFormatWithPhotoAndOptions,
        sendMessage: async(ctx: TelegramContext) => {
            if(!ctx.scene.states.flashcard.photo) {
                studyLanguageActions['VOCABULARY.STUDY_LANGUAGE.MODELS.WITH_OPTIONS'].sendMessage(ctx);

                return;
            }

            const sentMessage = await ctx.sendPhoto(
                ctx.scene.states.flashcard.photo,
                getQuestion(ctx),
                createBigButtonKeyboard(ctx.scene.states.flashcard.answerOptions || [])
            );

            ctx.scene.states.queueOnDelete.push(sentMessage.message_id);
        }
    },
    'BUTTONS.CANCEL': {}
}