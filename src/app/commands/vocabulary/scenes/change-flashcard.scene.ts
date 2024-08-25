import { plainToClass } from 'class-transformer';
import { Apply, CreateScene } from '../../../../core';
import { TelegramContext } from '../../../../core/ctx.class';
import { ModifyParams } from '../../../../core/decorators/modify-params/modify-params.decorator';
import { CreateSelectButtonComposer, CreateTextComposer } from '../../../../core/decorators/scene/composers';
import { Scene } from '../../../../core/decorators/scene/types';
import { Languages } from '../../../../core/language-interface/enums';
import { translate } from '../../../../core/language-interface/translate.alghoritm';
import { createBigButtonKeyboard, createButtonKeyboard } from '../../../../core/telegram-utils';
import { Flashcard } from '../../../services/database/vocabulary/types';
import { vocabularyService } from '../../../services/database/vocabulary/vocabulary.service';
import { SelectLanguageAction } from '../../../shared/actions/select-learning-language.action';
import { VocabularyManaging } from '../../../shared/classes';
import { LanguageJsonFormat } from '../../../shared/constants';
import { IsLearningLanguageMiddleware } from '../../../shared/middlewares';
import { GetVocabularyManaging } from '../../../shared/modify-params';
import { TransformLanguage } from '../../../shared/modify-params/transform-language.modify-param';
import { IsDifferenceBetweenOldNewVersionsFlashcardPossibleError, WordLanguageIncorrectPossibleError } from '../../../shared/possible-errors';
import { checkValid, transformToButtonActions } from '../../../shared/utils';
import { getNavigationButtons } from '../../../shared/utils';
import { ChangeFlashcardDto } from './shared/dto';
import { IsFoundWordInVocabularyMiddleware } from './shared/middlewares';

@CreateScene('vocabulary-change-flashcard-scene')
export class VocabularyChangeFlashcardScene implements Scene {
    @ModifyParams()
    start(ctx: TelegramContext, @GetVocabularyManaging() vocabularyManaging: VocabularyManaging ) {
        SelectLanguageAction(ctx, vocabularyManaging, true);
    }

    @CreateSelectButtonComposer('language', LanguageJsonFormat, true)
    @Apply({middlewares: [IsLearningLanguageMiddleware], possibleErrors: []})
    afterSelectLanguage(ctx: TelegramContext) {
        ctx.reply(
            translate('VOCABULARY.CHANGE_FLASHCARD.ASK_INPUT', ctx.session['user'].interfaceLanguage),
            createButtonKeyboard(transformToButtonActions(['BUTTONS.CANCEL'], ctx.session['user'].interfaceLanguage))
        );

        ctx.scene.nextAction();
    }

    @CreateTextComposer('word', true)
    @Apply({middlewares: [IsFoundWordInVocabularyMiddleware], possibleErrors: []})
    @ModifyParams()
    afterInputWordToChange(ctx: TelegramContext, @TransformLanguage('language') language: Languages) {
        ctx.scene.states.newFlashcard = plainToClass(
            ChangeFlashcardDto,
            {
                word: '',
                wordLanguage: language,
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
    @Apply({middlewares: [], possibleErrors: [WordLanguageIncorrectPossibleError]})
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
    @Apply({middlewares: [], possibleErrors: [WordLanguageIncorrectPossibleError, IsDifferenceBetweenOldNewVersionsFlashcardPossibleError]})
    async afterInputNewTranslate(ctx: TelegramContext) {
        ctx.scene.states.newFlashcard.translate = ctx.scene.states.newTranslate;

        await checkValid(ctx.scene.states.newFlashcard);

        const flashcards = [...ctx.scene.states.vocabulary.flashcards] as Flashcard[];

        flashcards[ctx.scene.states.id] = ctx.scene.states.newFlashcard.toFlashcardFormat();

        await vocabularyService.update(
            {user: ctx.session['user'], language: ctx.scene.states.language},
            {flashcards}
        );

        ctx.scene.states.vocabulary.flashcards[ctx.scene.states.id] = flashcards[ctx.scene.states.id];

        ctx.reply(
            translate('VOCABULARY.CHANGE_FLASHCARD.FINISHED', ctx.session['user'].interfaceLanguage),
            getNavigationButtons()
        );

        ctx.scene.leaveScene();
    }
}