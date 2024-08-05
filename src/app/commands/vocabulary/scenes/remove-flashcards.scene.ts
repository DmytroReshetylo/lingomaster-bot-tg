import { Apply, CreateScene } from '../../../../core';
import { CreateSelectButtonComposer, CreateTextComposer } from '../../../../core/decorators/scene/composers';
import { Scene } from '../../../../core/decorators/scene/types';
import { Languages } from '../../../../core/language-interface/enums';
import { translate } from '../../../../core/language-interface/translate.alghoritm';
import { createButtonKeyboard } from '../../../../core/telegram-utils';
import { Ctx } from '../../../../core/types';
import { vocabularyService } from '../../../services/database/vocabulary/vocabulary.service';
import { IsLearningLanguageMiddleware } from '../../../shared/middlewares';
import { transformLanguageToJsonFormat, transformToButtonActions } from '../../../shared/utils';
import { getNavigationButtons } from '../../../shared/utils';
import { getStudyLanguage, getVocabulary } from './shared/utils';

@CreateScene('vocabulary-delete-flashcards-scene')
export class VocabularyRemoveFlashcardsScene implements Scene {
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
    @Apply({middlewares: [IsLearningLanguageMiddleware], possibleErrors: []})
    afterSelectLanguage(ctx: Ctx) {
        ctx.wizard.state.language = translate(ctx.wizard.state.language, Languages.en);

        ctx.reply(
            translate('VOCABULARY.DEL_FLASHCARDS.ASK_INPUT', ctx.session.user.interfaceLanguage),
            transformToButtonActions(['BUTTONS.CANCEL'], ctx.session.user.interfaceLanguage)
        );

        ctx.wizard.next();
    }

    @CreateTextComposer('text', true)
    @Apply({middlewares: [], possibleErrors: []})
    async afterInputWords(ctx: Ctx) {
        const words: string[] = ctx.wizard.state.text.split('\n');

        const vocabulary = getVocabulary(ctx.session.vocabularies, ctx.wizard.state.language);

        const newFlashcards = vocabulary.flashcards.filter(flashcard => !words.includes(flashcard.word));

        await vocabularyService.updateFlashcards(ctx.session.user, ctx.wizard.state.language, newFlashcards);

        vocabulary.flashcards = newFlashcards;

        ctx.reply(translate('VOCABULARY.DEL_FLASHCARDS.FINISHED', ctx.session.user.interfaceLanguage), getNavigationButtons());

        ctx.scene.leave();
    }
}