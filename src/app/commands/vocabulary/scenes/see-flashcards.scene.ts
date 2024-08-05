import { Apply, CreateScene } from '../../../../core';
import { CreateSelectButtonComposer } from '../../../../core/decorators/scene/composers';
import { Scene } from '../../../../core/decorators/scene/types';
import { Languages } from '../../../../core/language-interface/enums';
import { translate } from '../../../../core/language-interface/translate.alghoritm';
import { createButtonKeyboard } from '../../../../core/telegram-utils';
import { Ctx } from '../../../../core/types';
import { IsLearningLanguageMiddleware } from '../../../shared/middlewares';
import { getNavigationButtons, toStringFlashcards, transformLanguageToJsonFormat, transformToButtonActions } from '../../../shared/utils';
import { IsNotEmptyVocabularyMiddleware } from './shared/middlewares';
import { getStudyLanguage, getVocabulary } from './shared/utils';

@CreateScene('vocabulary-see-flashcards-scene')
export class VocabularySeeFlashcardsScene implements Scene {
    start(ctx: Ctx) {
        ctx.reply(
            translate('INFO.CHOOSE_LANGUAGE', ctx.session.user.interfaceLanguage),
            createButtonKeyboard(
                transformToButtonActions([
                    ...transformLanguageToJsonFormat(getStudyLanguage(ctx.session.vocabularies)),
                    'BUTTONS.CANCEL'],
                    ctx.session.user.interfaceLanguage
                )
            )
        );

        ctx.wizard.next();
    }

    @CreateSelectButtonComposer('language', transformLanguageToJsonFormat(Object.values(Languages) as Languages[]), true)
    @Apply({middlewares: [IsLearningLanguageMiddleware, IsNotEmptyVocabularyMiddleware], possibleErrors: []})
    afterSelectLanguage(ctx: Ctx) {
        ctx.reply(
            toStringFlashcards(ctx.wizard.state.vocabulary),
            getNavigationButtons()
        );

        ctx.scene.leave();
    }
}