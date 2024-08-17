import { Apply, CreateScene } from '../../../../core';
import { TelegramContext } from '../../../../core/ctx.class';
import { CreateSelectButtonComposer } from '../../../../core/decorators/scene/composers';
import { Scene } from '../../../../core/decorators/scene/types';
import { Languages } from '../../../../core/language-interface/enums';
import { translate } from '../../../../core/language-interface/translate.alghoritm';
import { createButtonKeyboard } from '../../../../core/telegram-utils';
import { IsLearningLanguageMiddleware } from '../../../shared/middlewares';
import { getNavigationButtons, toStringFlashcards, transformLanguageToJsonFormat, transformToButtonActions } from '../../../shared/utils';
import { IsNotEmptyVocabularyMiddleware } from './shared/middlewares';
import { getStudyLanguage, getVocabulary } from './shared/utils';

@CreateScene('vocabulary-see-flashcards-scene')
export class VocabularySeeFlashcardsScene implements Scene {
    start(ctx: TelegramContext) {
        ctx.reply(
            translate('INFO.CHOOSE_LANGUAGE', ctx.session['user'].interfaceLanguage),
            createButtonKeyboard(
                transformToButtonActions([
                    ...transformLanguageToJsonFormat(getStudyLanguage(ctx.session['vocabularies'])),
                    'BUTTONS.CANCEL'],
                    ctx.session['user'].interfaceLanguage
                )
            )
        );

        ctx.scene.nextAction();
    }

    @CreateSelectButtonComposer('language', transformLanguageToJsonFormat(Object.values(Languages) as Languages[]), true)
    @Apply({middlewares: [IsLearningLanguageMiddleware, IsNotEmptyVocabularyMiddleware], possibleErrors: []})
    afterSelectLanguage(ctx: TelegramContext) {
        ctx.reply(
            toStringFlashcards(ctx.scene.states.vocabulary),
            getNavigationButtons()
        );

        ctx.scene.leaveScene();
    }
}