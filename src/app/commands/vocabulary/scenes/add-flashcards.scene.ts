import { plainToClass } from 'class-transformer';
import { Apply, CreateScene } from '../../../../core';
import { CreateSelectButtonComposer, CreateTextComposer } from '../../../../core/decorators/scene/composers';
import { Scene } from '../../../../core/decorators/scene/types';
import { Languages } from '../../../../core/language-interface/enums';
import { translate } from '../../../../core/language-interface/translate.alghoritm';
import { Ctx } from '../../../../core/types';
import { createButtonKeyboard } from '../../../../core/telegram-utils';
import { photoManagerService } from '../../../services/photo-manager/photo-manager.service';
import { Flashcard } from '../../../services/database/vocabulary/types';
import { vocabularyService } from '../../../services/database/vocabulary/vocabulary.service';
import { IsLearningLanguageMiddleware } from '../../../shared/middlewares';
import { InputIncorrectPossibleError, WordLanguageIncorrectPossibleError } from '../../../shared/possible-errors';
import { checkValid, transformLanguageToJsonFormat, transformToButtonActions } from '../../../shared/utils';
import { deleteEquallyRows } from '../../../shared/utils';
import { getNavigationButtons } from '../../../shared/utils';
import { AddFlashcardDto } from './shared/dto';
import { getStudyLanguage, getVocabulary } from './shared/utils';

@CreateScene('vocabulary-add-flashcards-scene')
export class VocabularyAddFlashcardsScene implements Scene {
    async start(ctx: Ctx) {
        ctx.reply(
            translate('INFO.CHOOSE_LANGUAGE', ctx.session.user.interfaceLanguage),
            createButtonKeyboard(
                transformToButtonActions([
                    ...transformLanguageToJsonFormat(getStudyLanguage(ctx.session.vocabularies)),
                    'BUTTONS.CANCEL'],
                    ctx.session.user.interfaceLanguage
                )
            )
        )

        ctx.wizard.next();
    }

    @CreateSelectButtonComposer('language', transformLanguageToJsonFormat(Object.values(Languages) as Languages[]), true)
    @Apply({middlewares: [IsLearningLanguageMiddleware], possibleErrors: []})
    afterSelectLanguage(ctx: Ctx) {
        ctx.wizard.state.language = translate(ctx.wizard.state.language, Languages.en);

        ctx.reply(
            translate('VOCABULARY.ADD_FLASHCARDS.ASK_INPUT', ctx.session.user.interfaceLanguage),
            createButtonKeyboard(transformToButtonActions(['BUTTONS.CANCEL'], ctx.session.user.interfaceLanguage))
        );

        ctx.wizard.next();
    }

    @CreateTextComposer('text', true)
    @Apply({middlewares: [], possibleErrors: [InputIncorrectPossibleError, WordLanguageIncorrectPossibleError]})
    async afterInputFlashcards(ctx: Ctx) {
        const input: string[] = ctx.wizard.state.text.split('\n');

        const flashcards: Flashcard[] = await Promise.all(input.map(async (row: string) => {
            const [word, translate, ...sth] = row.replace(/[\u2012-\u2015]/g, '-').split(' - ');

            if (sth.length || !translate) {
                throw new Error('VALIDATORS.INCORRECT_FORMAT_INPUT');
            }

            const addFlashcardDto = plainToClass(
                AddFlashcardDto,
                {word, translate, wordLanguage: ctx.wizard.state.language}
            );

            await checkValid(addFlashcardDto);

            return addFlashcardDto.toFlashcardFormat();
        }));

        const vocabulary = getVocabulary(ctx.session.vocabularies, ctx.wizard.state.language);

        const newFlashcards = [
            ...vocabulary.flashcards,
            ...deleteEquallyRows(flashcards, vocabulary.flashcards, 'word')
        ];

        await vocabularyService.updateFlashcards(
            ctx.session.user,
            ctx.wizard.state.language,
            newFlashcards
        );

        vocabulary.flashcards = newFlashcards;

        photoManagerService.generatePhotoDescriptorsForUser(ctx.session.user, vocabulary);

        ctx.reply(
            translate('VOCABULARY.ADD_FLASHCARDS.FINISHED', ctx.session.user.interfaceLanguage),
            getNavigationButtons()
        );

        ctx.scene.leave();
    }
}