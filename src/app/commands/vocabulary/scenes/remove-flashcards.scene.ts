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
import { IsLearningLanguageMiddleware } from '../../../shared/middlewares';
import { GetStudyLanguageManaging, TransformLanguage } from '../../../shared/modify-params';
import { ApplyServiceLearningPartAction } from '../../../shared/part-actions';

@CreateScene('vocabulary-delete-flashcards-scene')
export class VocabularyRemoveFlashcardsScene implements Scene {

    @ModifyParams()
    start(ctx: TelegramContext, @GetStudyLanguageManaging() StudyLanguageManaging: StudyLanguageManaging ) {
        SelectLanguageAction(ctx, StudyLanguageManaging, true);
    }

    @CreateSelectButtonComposer('language', LanguageJsonFormat, true)
    @Apply({middlewares: [IsLearningLanguageMiddleware], possibleErrors: []})
    afterSelectLanguage(ctx: TelegramContext) {
        CreateReplyAction(
            ctx,
            'VOCABULARY.DEL_FLASHCARDS.ASK_INPUT',
            ctx.session[EntityNames.User].interfaceLanguage,
            'button',
            ['BUTTONS.CANCEL']
        );
    }

    @CreateTextComposer('text', true)
    @Apply({middlewares: [], possibleErrors: []})
    @ModifyParams()
    async afterInputWords(
        ctx: TelegramContext,
        @TransformLanguage('language') language: Languages,
        @GetStudyLanguageManaging() studyLanguageManaging: StudyLanguageManaging
    ) {
        const words: string[] = ctx.scene.states.text.split('\n');

        const studyLanguageEntity = studyLanguageManaging.getEntity(language);

        await ApplyServiceLearningPartAction(ctx, studyLanguageEntity, studyLanguageEntity[EntityNames.Vocabulary].id, vocabularyService, 'remove', words);

        CreateFinishReplyAction(ctx, 'VOCABULARY.DEL_FLASHCARDS.FINISHED', ctx.session[EntityNames.User].interfaceLanguage);
    }
}