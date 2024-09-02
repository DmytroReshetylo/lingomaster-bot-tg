import { plainToClass } from 'class-transformer';
import { Apply, CreateScene } from '../../../../core';
import { TelegramContext } from '../../../../core/ctx.class';
import { ModifyParams } from '../../../../core/decorators/modify-params/modify-params.decorator';
import { CreateSelectButtonComposer, CreateTextComposer } from '../../../../core/decorators/scene/composers';
import { Scene } from '../../../../core/decorators/scene/types';
import { Languages } from '../../../../core/language-interface/enums';
import { EntityNames } from '../../../services/database/entities/entity-names';
import { Flashcard } from '../../../services/database/entities/vocabulary/types';
import { vocabularyService } from '../../../services/database/entities/vocabulary/vocabulary.service';
import { CreateFinishReplyAction, CreateReplyAction, SelectLanguageAction } from '../../../shared/actions';
import { StudyLanguageManaging } from '../../../shared/classes';
import { LanguageJsonFormat } from '../../../shared/constants';
import { IsLearningLanguageMiddleware, IsNotPhohibitedSymbolsMiddleware } from '../../../shared/middlewares';
import { GetStudyLanguageManaging, TransformLanguage } from '../../../shared/modify-params';
import { ApplyServiceLearningPartAction } from '../../../shared/part-actions';
import { InputIncorrectPossibleError, WordLanguageIncorrectPossibleError } from '../../../shared/possible-errors';
import { checkValid } from '../../../shared/utils';
import { AddFlashcardDto } from './shared/dto';

@CreateScene('vocabulary-add-flashcards-scene')
export class VocabularyAddFlashcardsScene implements Scene {

    @ModifyParams()
    start(ctx: TelegramContext, @GetStudyLanguageManaging() StudyLanguageManaging: StudyLanguageManaging ) {
        SelectLanguageAction(ctx, StudyLanguageManaging, true);
    }

    @CreateSelectButtonComposer('language', LanguageJsonFormat, true)
    @Apply({middlewares: [IsLearningLanguageMiddleware], possibleErrors: []})
    afterSelectLanguage(ctx: TelegramContext) {
        CreateReplyAction(
            ctx,
            'VOCABULARY.ADD_FLASHCARDS.ASK_INPUT',
            ctx.session[EntityNames.User].interfaceLanguage,
            'button',
            ['BUTTONS.CANCEL']
        );
    }

    @CreateTextComposer('text', true)
    @Apply({
        middlewares: [IsNotPhohibitedSymbolsMiddleware(['[', ']'], 'MIDDLEWARES.PROHIBITED_BRACKETS')],
        possibleErrors: [InputIncorrectPossibleError, WordLanguageIncorrectPossibleError]
    })
    @ModifyParams()
    async afterInputFlashcards(
        ctx: TelegramContext,
        @TransformLanguage('language') language: Languages,
        @GetStudyLanguageManaging() studyLanguageManaging: StudyLanguageManaging
    ) {
        const input: string[] = ctx.scene.states.text.split('\n');

        const flashcards: Flashcard[] = await Promise.all(input.map(async (row: string) => {
            const [word, translate, ...sth] = row.replace(/[-‒–—―−‐‑]/g, '-').split('-');

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

        const studyLanguageEntity = studyLanguageManaging.getEntity(language);

        await ApplyServiceLearningPartAction(ctx, studyLanguageEntity, studyLanguageEntity[EntityNames.Vocabulary].id, vocabularyService, 'add', flashcards);

        CreateFinishReplyAction(ctx, 'VOCABULARY.ADD_FLASHCARDS.FINISHED', ctx.session[EntityNames.User].interfaceLanguage);
    }
}