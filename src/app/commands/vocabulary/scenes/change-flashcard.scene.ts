import { plainToClass } from 'class-transformer';
import { Apply, CreateScene } from '../../../../core';
import { TelegramContext } from '../../../../core/ctx.class';
import { ModifyParams } from '../../../../core/decorators/modify-params/modify-params.decorator';
import { CreateSelectButtonComposer, CreateTextComposer } from '../../../../core/decorators/scene/composers';
import { Scene } from '../../../../core/decorators/scene/types';
import { Languages } from '../../../../core/language-interface/enums';
import { EntityNames } from '../../../services/database/entities/entity-names';
import { vocabularyService } from '../../../services/database/entities/vocabulary/vocabulary.service';
import { CreateFinishReplyAction, CreateReplyAction, SelectLanguageAction } from '../../../shared/actions';
import { StudyLanguageManaging } from '../../../shared/classes';
import { LanguageJsonFormat } from '../../../shared/constants';
import { IsLearningLanguageMiddleware, IsNotPhohibitedSymbolsMiddleware } from '../../../shared/middlewares';
import { GetFromStates, GetStudyLanguageManaging, TransformLanguage } from '../../../shared/modify-params';
import { AddToDTOPartAction, ApplyServiceLearningPartAction } from '../../../shared/part-actions';
import { IsDifferenceBetweenOldNewVersionsFlashcardPossibleError, WordLanguageIncorrectPossibleError } from '../../../shared/possible-errors';
import { ChangeFlashcardDto } from './shared/dto';
import { IsFoundWordInVocabularyMiddleware } from './shared/middlewares';

@CreateScene('vocabulary-change-flashcard-scene')
export class VocabularyChangeFlashcardScene implements Scene {
    @ModifyParams()
    start(ctx: TelegramContext, @GetStudyLanguageManaging() StudyLanguageManaging: StudyLanguageManaging ) {
        SelectLanguageAction(ctx, StudyLanguageManaging, true);
    }

    @CreateSelectButtonComposer('language', LanguageJsonFormat, true)
    @Apply({middlewares: [IsLearningLanguageMiddleware], possibleErrors: []})
    afterSelectLanguage(ctx: TelegramContext) {
        CreateReplyAction(
            ctx,
            'VOCABULARY.CHANGE_FLASHCARD.ASK_INPUT',
            ctx.session[EntityNames.User].interfaceLanguage,
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
                oldFlashcardVersion: ctx.scene.states.vocabulary.json[ctx.scene.states.id]
            }
        );

        CreateReplyAction(
            ctx,
            'VOCABULARY.CHANGE_FLASHCARD.ASK_INPUT_NEW_WORD',
            ctx.session[EntityNames.User].interfaceLanguage,
            'bigButton',
            [ctx.scene.states.newFlashcard.oldFlashcardVersion.word, 'BUTTONS.CANCEL']
        );
    }

    @CreateTextComposer('newWord', false, true)
    @Apply({
        middlewares: [IsNotPhohibitedSymbolsMiddleware(['[', ']'], 'MIDDLEWARES.PROHIBITED_BRACKETS')],
        possibleErrors: [WordLanguageIncorrectPossibleError]
    })
    @ModifyParams()
    async afterInputNewWord(ctx: TelegramContext, @GetFromStates('newFlashcard') dto: ChangeFlashcardDto) {
        await AddToDTOPartAction(dto, 'word', ctx.scene.states.newWord);

        CreateReplyAction(
            ctx,
            'VOCABULARY.CHANGE_FLASHCARD.ASK_INPUT_NEW_TRANSLATE',
            ctx.session[EntityNames.User].interfaceLanguage,
            'bigButton',
            [ctx.scene.states.newFlashcard.oldFlashcardVersion.translate, 'BUTTONS.CANCEL']
        );
    }

    @CreateTextComposer('newTranslate', false, true)
    @Apply({
        middlewares: [IsNotPhohibitedSymbolsMiddleware(['[', ']'], 'MIDDLEWARES.PROHIBITED_BRACKETS')],
        possibleErrors: [WordLanguageIncorrectPossibleError, IsDifferenceBetweenOldNewVersionsFlashcardPossibleError]
    })
    @ModifyParams()
    async afterInputNewTranslate(
        ctx: TelegramContext,
        @GetFromStates('newFlashcard') dto: ChangeFlashcardDto,
        @TransformLanguage('language') language: Languages,
        @GetStudyLanguageManaging() studyLanguageManaging: StudyLanguageManaging
    ) {
        await AddToDTOPartAction(dto, 'translate', ctx.scene.states.newTranslate);

        const studyLanguageEntity = studyLanguageManaging.getEntity(language);

        await ApplyServiceLearningPartAction(ctx, studyLanguageEntity, studyLanguageEntity[EntityNames.Vocabulary].id, vocabularyService, 'update', await dto.toFlashcardFormat());

        CreateFinishReplyAction(ctx, 'VOCABULARY.CHANGE_FLASHCARD.FINISHED', ctx.session[EntityNames.User].interfaceLanguage);
    }
}