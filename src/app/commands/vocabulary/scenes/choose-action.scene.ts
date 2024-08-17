import { CreateScene } from '../../../../core';
import { TelegramContext } from '../../../../core/ctx.class';
import { Scene } from '../../../../core/decorators/scene/types';
import { CreateSelectButtonComposer } from '../../../../core/decorators/scene/composers';
import { createButtonKeyboard } from '../../../../core/telegram-utils';
import { translate } from '../../../../core/language-interface/translate.alghoritm';
import { transformToButtonActions } from '../../../shared/utils';

const actions = [
    'VOCABULARY.SEE_FLASHCARDS.TITLE',
    'VOCABULARY.STUDY_NEW_LANGUAGE.TITLE',
    'VOCABULARY.STUDY_LANGUAGE.TITLE',
    'VOCABULARY.ADD_FLASHCARDS.TITLE',
    'VOCABULARY.CHANGE_FLASHCARD.TITLE',
    'VOCABULARY.DEL_FLASHCARDS.TITLE',
    'BUTTONS.CANCEL'
]

@CreateScene('vocabulary-choose-action-scene')
export class VocabularyChooseActionScene implements Scene {
    start(ctx: TelegramContext) {
        ctx.reply(
            translate('INFO.SELECT_ACTION', ctx.session['user'].interfaceLanguage),
            createButtonKeyboard(transformToButtonActions(actions, ctx.session['user'].interfaceLanguage))
        );

        ctx.scene.nextAction();
    }

    @CreateSelectButtonComposer('action', actions, true)
    afterSelectAction(ctx: TelegramContext) {
        switch (ctx.scene.states.action) {
            case 'VOCABULARY.SEE_FLASHCARDS.TITLE': {
                return ctx.scene.enterScene('vocabulary-see-flashcards-scene');
            }
            case 'VOCABULARY.STUDY_NEW_LANGUAGE.TITLE': {
                return ctx.scene.enterScene('vocabulary-study-new-language-scene');
            }
            case 'VOCABULARY.STUDY_LANGUAGE.TITLE': {
                return ctx.scene.enterScene('vocabulary-study-language-scene');
            }
            case 'VOCABULARY.ADD_FLASHCARDS.TITLE': {
                return ctx.scene.enterScene('vocabulary-add-flashcards-scene');
            }
            case 'VOCABULARY.CHANGE_FLASHCARD.TITLE': {
                return ctx.scene.enterScene('vocabulary-change-flashcard-scene');
            }
            case 'VOCABULARY.DEL_FLASHCARDS.TITLE': {
                return ctx.scene.enterScene('vocabulary-delete-flashcards-scene');
            }
        }
    }
}