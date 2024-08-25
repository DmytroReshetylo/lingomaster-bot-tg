import { plainToClass } from 'class-transformer';
import { Apply, CreateScene } from '../../../../core';
import { TelegramContext } from '../../../../core/ctx.class';
import { ModifyParams } from '../../../../core/decorators/modify-params/modify-params.decorator';
import { CreateSelectButtonComposer, CreateTextComposer } from '../../../../core/decorators/scene/composers';
import { Scene } from '../../../../core/decorators/scene/types';
import { Languages } from '../../../../core/language-interface/enums';
import { translate } from '../../../../core/language-interface/translate.alghoritm';
import { createButtonKeyboard } from '../../../../core/telegram-utils';
import { photoManagerService } from '../../../services/photo-manager/photo-manager.service';
import { Flashcard } from '../../../services/database/vocabulary/types';
import { vocabularyService } from '../../../services/database/vocabulary/vocabulary.service';
import { SelectLanguageAction } from '../../../shared/actions/select-learning-language.action';
import { VocabularyManaging } from '../../../shared/classes';
import { LanguageJsonFormat } from '../../../shared/constants';
import { IsLearningLanguageMiddleware } from '../../../shared/middlewares';
import { GetVocabularyManaging } from '../../../shared/modify-params';
import { TransformLanguage } from '../../../shared/modify-params';
import { InputIncorrectPossibleError, WordLanguageIncorrectPossibleError } from '../../../shared/possible-errors';
import { checkValid, transformToButtonActions } from '../../../shared/utils';
import { deleteEquallyRows } from '../../../shared/utils';
import { getNavigationButtons } from '../../../shared/utils';
import { AddFlashcardDto } from './shared/dto';
import { getVocabulary } from './shared/utils';

@CreateScene('vocabulary-add-flashcards-scene')
export class VocabularyAddFlashcardsScene implements Scene {

    @ModifyParams()
    start(ctx: TelegramContext, @GetVocabularyManaging() vocabularyManaging: VocabularyManaging ) {
        SelectLanguageAction(ctx, vocabularyManaging, true);
    }

    @CreateSelectButtonComposer('language', LanguageJsonFormat, true)
    @Apply({middlewares: [IsLearningLanguageMiddleware], possibleErrors: []})
    afterSelectLanguage(ctx: TelegramContext) {
        ctx.reply(
            translate('VOCABULARY.ADD_FLASHCARDS.ASK_INPUT', ctx.session['user'].interfaceLanguage),
            createButtonKeyboard(transformToButtonActions(['BUTTONS.CANCEL'], ctx.session['user'].interfaceLanguage))
        );

        ctx.scene.nextAction();
    }

    @CreateTextComposer('text', true)
    @Apply({middlewares: [], possibleErrors: [InputIncorrectPossibleError, WordLanguageIncorrectPossibleError]})
    @ModifyParams()
    async afterInputFlashcards(ctx: TelegramContext, @TransformLanguage('language') language: Languages) {
        const input: string[] = ctx.scene.states.text.split('\n');

        const flashcards: Flashcard[] = await Promise.all(input.map(async (row: string) => {
            const [word, translate, ...sth] = row.replace(/[\u2012-\u2015]/g, '-').split(' - ');

            if (sth.length || !translate) {
                throw new Error('VALIDATORS.INCORRECT_FORMAT_INPUT');
            }

            const addFlashcardDto = plainToClass(
                AddFlashcardDto,
                {word, translate, wordLanguage: language}
            );

            await checkValid(addFlashcardDto);

            return addFlashcardDto.toFlashcardFormat();
        }));

        const vocabulary = getVocabulary(ctx.session['vocabularies'], language);

        const newFlashcards = [
            ...vocabulary.flashcards,
            ...deleteEquallyRows(flashcards, vocabulary.flashcards, 'word')
        ];

        await vocabularyService.update(
        {user: ctx.session['user'], language},
            {flashcards: newFlashcards}
        );

        vocabulary.flashcards = newFlashcards;

        photoManagerService.generatePhotoDescriptorsForUser(ctx.session['user'], vocabulary);

        ctx.reply(
            translate('VOCABULARY.ADD_FLASHCARDS.FINISHED', ctx.session['user'].interfaceLanguage),
            getNavigationButtons()
        );

        ctx.scene.leaveScene();
    }
}