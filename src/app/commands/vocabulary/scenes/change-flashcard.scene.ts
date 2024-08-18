import { plainToClass } from 'class-transformer';
import { Apply, CreateScene } from '../../../../core';
import { TelegramContext } from '../../../../core/ctx.class';
import { CreateSelectButtonComposer, CreateTextComposer } from '../../../../core/decorators/scene/composers';
import { Scene } from '../../../../core/decorators/scene/types';
import { Languages } from '../../../../core/language-interface/enums';
import { translate } from '../../../../core/language-interface/translate.alghoritm';
import { createBigButtonKeyboard, createButtonKeyboard } from '../../../../core/telegram-utils';
import { Flashcard } from '../../../services/database/vocabulary/types';
import { vocabularyService } from '../../../services/database/vocabulary/vocabulary.service';
import { IsLearningLanguageMiddleware } from '../../../shared/middlewares';
import { IsDifferenceBetweenOldNewVersionsFlashcardPossibleError, WordLanguageIncorrectPossibleError } from '../../../shared/possible-errors';
import { checkValid, transformLanguageToJsonFormat, transformToButtonActions } from '../../../shared/utils';
import { getNavigationButtons } from '../../../shared/utils';
import { ChangeFlashcardDto } from './shared/dto';
import { IsFoundWordInVocabularyMiddleware } from './shared/middlewares';
import { getStudyLanguage } from './shared/utils';

@CreateScene('vocabulary-change-flashcard-scene')
export class VocabularyChangeFlashcardScene implements Scene {
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
    @Apply({middlewares: [IsLearningLanguageMiddleware], possibleErrors: []})
    afterSelectLanguage(ctx: TelegramContext) {
        ctx.scene.states.language = translate(ctx.scene.states.language, Languages.en);

        ctx.reply(
            translate('VOCABULARY.CHANGE_FLASHCARD.ASK_INPUT', ctx.session['user'].interfaceLanguage),
            createButtonKeyboard(transformToButtonActions(['BUTTONS.CANCEL'], ctx.session['user'].interfaceLanguage))
        );

        ctx.scene.nextAction();
    }

    @CreateTextComposer('word', true)
    @Apply({middlewares: [IsFoundWordInVocabularyMiddleware], possibleErrors: []})
    afterInputWordToChange(ctx: TelegramContext) {
        ctx.scene.states.newFlashcard = plainToClass(
            ChangeFlashcardDto,
            {
                word: '',
                wordLanguage: ctx.scene.states.language,
                translate: '',
                oldFlashcardVersion: ctx.scene.states.vocabulary.flashcards[ctx.scene.states.id]
            }
        );

        ctx.reply(
            translate('VOCABULARY.CHANGE_FLASHCARD.ASK_INPUT_NEW_WORD', ctx.session['user'].interfaceLanguage),
            createBigButtonKeyboard([
                ctx.scene.states.newFlashcard.oldFlashcardVersion.word,
                translate('BUTTONS.CANCEL', ctx.session['user'].interfaceLanguage)
            ]),
        );

        ctx.scene.nextAction();
    }

    @CreateTextComposer('newWord', false, true)
    @Apply({
        middlewares: [],
        possibleErrors: [WordLanguageIncorrectPossibleError]
    })
    async afterInputNewWord(ctx: TelegramContext) {
        ctx.scene.states.newFlashcard.word = ctx.scene.states.newWord;

        await checkValid(ctx.scene.states.newFlashcard);

        ctx.reply(
            translate('VOCABULARY.CHANGE_FLASHCARD.ASK_INPUT_NEW_TRANSLATE', ctx.session['user'].interfaceLanguage),
            createBigButtonKeyboard([
                ctx.scene.states.newFlashcard.oldFlashcardVersion.translate,
                translate('BUTTONS.CANCEL', ctx.session['user'].interfaceLanguage)
            ]),
        );

        ctx.scene.nextAction();
    }

    @CreateTextComposer('newTranslate', false, true)
    @Apply({
        middlewares: [],
        possibleErrors: [WordLanguageIncorrectPossibleError, IsDifferenceBetweenOldNewVersionsFlashcardPossibleError]
    })
    async afterInputNewTranslate(ctx: TelegramContext) {
        ctx.scene.states.newFlashcard.translate = ctx.scene.states.newTranslate;

        await checkValid(ctx.scene.states.newFlashcard);

        const flashcards = [...ctx.scene.states.vocabulary.flashcards] as Flashcard[];

        flashcards[ctx.scene.states.id] = ctx.scene.states.newFlashcard.toFlashcardFormat();

        await vocabularyService.updateFlashcards(ctx.session['user'], ctx.scene.states.language, flashcards);

        ctx.scene.states.vocabulary.flashcards[ctx.scene.states.id] = flashcards[ctx.scene.states.id];

        ctx.reply(
            translate('VOCABULARY.CHANGE_FLASHCARD.FINISHED', ctx.session['user'].interfaceLanguage),
            getNavigationButtons()
        );

        ctx.scene.leaveScene();
    }
}