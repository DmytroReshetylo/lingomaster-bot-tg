import { plainToClass } from 'class-transformer';
import { Apply, CreateScene } from '../../../../core';
import { TelegramContext } from '../../../../core/ctx.class';
import { ModifyParams } from '../../../../core/decorators/modify-params/modify-params.decorator';
import { CreateSelectButtonComposer, CreateTextComposer } from '../../../../core/decorators/scene/composers';
import { Scene } from '../../../../core/decorators/scene/types';
import { Languages } from '../../../../core/language-interface/enums';
import { Flashcard } from '../../../services/database/vocabulary/types';
import { vocabularyService } from '../../../services/database/vocabulary/vocabulary.service';
import { CreateFinishReplyAction, CreateReplyAction } from '../../../shared/actions';
import { SelectLanguageAction } from '../../../shared/actions';
import { VocabularyManaging } from '../../../shared/classes';
import { LanguageJsonFormat } from '../../../shared/constants';
import { IsLearningLanguageMiddleware } from '../../../shared/middlewares';
import { GetVocabularyManaging } from '../../../shared/modify-params';
import { TransformLanguage } from '../../../shared/modify-params';
import { IsDifferenceBetweenOldNewVersionsFlashcardPossibleError, WordLanguageIncorrectPossibleError } from '../../../shared/possible-errors';
import { checkValid } from '../../../shared/utils';
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
        CreateReplyAction(
            ctx,
            'VOCABULARY.CHANGE_FLASHCARD.ASK_INPUT',
            ctx.session['user'].interfaceLanguage,
            'button',
            ['BUTTONS.CANCEL']
        );
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

        CreateReplyAction(
            ctx,
            'VOCABULARY.CHANGE_FLASHCARD.ASK_INPUT_NEW_WORD',
            ctx.session['user'].interfaceLanguage,
            'bigButton',
            [ctx.scene.states.newFlashcard.oldFlashcardVersion.word, 'BUTTONS.CANCEL']
        );
    }

    @CreateTextComposer('newWord', false, true)
    @Apply({middlewares: [], possibleErrors: [WordLanguageIncorrectPossibleError]})
    async afterInputNewWord(ctx: TelegramContext) {
        ctx.scene.states.newFlashcard.word = ctx.scene.states.newWord;

        await checkValid(ctx.scene.states.newFlashcard);

        CreateReplyAction(
            ctx,
            'VOCABULARY.CHANGE_FLASHCARD.ASK_INPUT_NEW_TRANSLATE',
            ctx.session['user'].interfaceLanguage,
            'bigButton',
            [ctx.scene.states.newFlashcard.oldFlashcardVersion.translate, 'BUTTONS.CANCEL']
        );
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

        CreateFinishReplyAction(ctx, 'VOCABULARY.CHANGE_FLASHCARD.FINISHED', ctx.session['user'].interfaceLanguage);
    }
}