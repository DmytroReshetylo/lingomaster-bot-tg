import { plainToClass } from 'class-transformer';
import { Apply, CreateScene } from '../../../../core';
import { CreateSelectButtonComposer, CreateTextComposer } from '../../../../core/decorators/scene/composers';
import { Scene } from '../../../../core/decorators/scene/types';
import { Languages } from '../../../../core/language-interface/enums';
import { translate } from '../../../../core/language-interface/translate.alghoritm';
import { createBigButtonKeyboard, createButtonKeyboard } from '../../../../core/telegram-utils';
import { Ctx } from '../../../../core/types';
import { photoManagerService } from '../../../services/photo-manager/photo-manager.service';
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
            translate('VOCABULARY.CHANGE_FLASHCARD.ASK_INPUT', ctx.session.user.interfaceLanguage),
            createButtonKeyboard(transformToButtonActions(['BUTTONS.CANCEL'], ctx.session.user.interfaceLanguage))
        );

        ctx.wizard.next();
    }

    @CreateTextComposer('word', true)
    @Apply({middlewares: [IsFoundWordInVocabularyMiddleware], possibleErrors: []})
    afterInputWordToChange(ctx: Ctx) {
        ctx.wizard.state.newFlashcard = plainToClass(
            ChangeFlashcardDto,
            {
                word: '',
                wordLanguage: ctx.wizard.state.language,
                translate: '',
                oldFlashcardVersion: ctx.wizard.state.vocabulary.flashcards[ctx.wizard.state.id]
            }
        );

        ctx.reply(
            translate('VOCABULARY.CHANGE_FLASHCARD.ASK_INPUT_NEW_WORD', ctx.session.user.interfaceLanguage),
            createBigButtonKeyboard([
                ctx.wizard.state.newFlashcard.oldFlashcardVersion.word,
                translate('BUTTONS.CANCEL', ctx.session.user.interfaceLanguage)
            ]),
        );

        ctx.wizard.next();
    }

    @CreateTextComposer('newWord', false, true)
    @Apply({
        middlewares: [],
        possibleErrors: [WordLanguageIncorrectPossibleError]
    })
    async afterInputNewWord(ctx: Ctx) {
        ctx.wizard.state.newFlashcard.word = ctx.wizard.state.newWord;

        await checkValid(ctx.wizard.state.newFlashcard);

        ctx.reply(
            translate('VOCABULARY.CHANGE_FLASHCARD.ASK_INPUT_NEW_TRANSLATE', ctx.session.user.interfaceLanguage),
            createBigButtonKeyboard([
                ctx.wizard.state.newFlashcard.oldFlashcardVersion.translate,
                translate('BUTTONS.CANCEL', ctx.session.user.interfaceLanguage)
            ]),
        );

        ctx.wizard.next();
    }

    @CreateTextComposer('newTranslate', false, true)
    @Apply({
        middlewares: [],
        possibleErrors: [WordLanguageIncorrectPossibleError, IsDifferenceBetweenOldNewVersionsFlashcardPossibleError]
    })
    async afterInputNewTranslate(ctx: Ctx) {
        ctx.wizard.state.newFlashcard.translate = ctx.wizard.state.newTranslate;

        await checkValid(ctx.wizard.state.newFlashcard);

        const flashcards = [...ctx.wizard.state.vocabulary.flashcards] as Flashcard[];

        flashcards[ctx.wizard.state.id] = ctx.wizard.state.newFlashcard.toFlashcardFormat();

        await vocabularyService.updateFlashcards(ctx.session.user, ctx.wizard.state.language, flashcards);

        ctx.wizard.state.vocabulary.flashcards[ctx.wizard.state.id] = flashcards[ctx.wizard.state.id];

        if(!flashcards[ctx.wizard.state.id].photoUrl) {
            photoManagerService.generatePhotoDescriptorsForUser(ctx.session.user, ctx.wizard.state.vocabulary);
        }

        ctx.reply(
            translate('VOCABULARY.CHANGE_FLASHCARD.FINISHED', ctx.session.user.interfaceLanguage),
            getNavigationButtons()
        );

        ctx.scene.leave();
    }
}