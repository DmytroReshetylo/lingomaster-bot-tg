import { translate } from '../../../../../../core/language-interface/translate.alghoritm';
import { createButtonKeyboard } from '../../../../../../core/telegram-utils';
import { Ctx } from '../../../../../../core/types';
import { transformToButtonActions } from '../../../../../shared/utils';
import { ShowFlashcardFormatWithOptions, ShowFlashcardFormatWithoutPhotoAndOptions, ShowFlashcardFormatWithPhoto, ShowFlashcardFormatWithPhotoAndOptions } from './show-flashcard-format-list';

function getQuestion(ctx: Ctx) {
    return `${translate('VOCABULARY.STUDY_LANGUAGE.STUDYING.ASK', ctx.session.user.interfaceLanguage)} ${ctx.wizard.state.flashcard.frontSide}`;
}

export const studyLanguageActions: any = {
    'VOCABULARY.STUDY_LANGUAGE.MODELS.WITHOUT_PHOTO_AND_OPTIONS': {
        showNextFlashcard: ShowFlashcardFormatWithoutPhotoAndOptions,
        sendMessage: async(ctx: Ctx) => {
            const sentMessage = await ctx.reply(
                getQuestion(ctx),
                createButtonKeyboard(transformToButtonActions(['BUTTONS.CANCEL'], ctx.session.user.interfaceLanguage))
            );

            ctx.wizard.state.queueOnDelete.push(sentMessage.message_id);
        }
    },
    'VOCABULARY.STUDY_LANGUAGE.MODELS.WITH_OPTIONS': {
        showNextFlashcard: ShowFlashcardFormatWithOptions,
        sendMessage: async(ctx: Ctx) => {
            const sentMessage = await ctx.reply(
                getQuestion(ctx),
                createButtonKeyboard(transformToButtonActions(['BUTTONS.CANCEL'], ctx.session.user.interfaceLanguage))
            );

            ctx.wizard.state.queueOnDelete.push(sentMessage.message_id);
        }
    },
    'VOCABULARY.STUDY_LANGUAGE.MODELS.WITH_PHOTO': {
        showNextFlashcard: ShowFlashcardFormatWithPhoto,
        sendMessage: async(ctx: Ctx) => {
            if(!ctx.wizard.state.flashcard.photo) {
                studyLanguageActions['VOCABULARY.STUDY_LANGUAGE.MODELS.WITHOUT_PHOTO_AND_OPTIONS'].sendMessage(ctx);

                return;
            }

            const sentMessage = await ctx.sendPhoto(
                ctx.wizard.state.flashcard.photo,
                {
                    caption: getQuestion(ctx),
                    ...createButtonKeyboard(transformToButtonActions(['BUTTONS.CANCEL'], ctx.session.user.interfaceLanguage))
                }
            );

            ctx.wizard.state.queueOnDelete.push(sentMessage.message_id);
        }
    },
    'VOCABULARY.STUDY_LANGUAGE.MODELS.WITH_PHOTO_AND_OPTIONS': {
        showNextFlashcard: ShowFlashcardFormatWithPhotoAndOptions,
        sendMessage: async(ctx: Ctx) => {
            if(!ctx.wizard.state.flashcard.photo) {
                studyLanguageActions['VOCABULARY.STUDY_LANGUAGE.MODELS.WITH_OPTIONS'].sendMessage(ctx);

                return;
            }

            const sentMessage = await ctx.sendPhoto(
                ctx.wizard.state.flashcard.photo,
                {
                    caption: getQuestion(ctx),
                    ...createButtonKeyboard(transformToButtonActions(['BUTTONS.CANCEL'], ctx.session.user.interfaceLanguage))
                }
            );

            ctx.wizard.state.queueOnDelete.push(sentMessage.message_id);
        }
    },
    'BUTTONS.CANCEL': {}
}