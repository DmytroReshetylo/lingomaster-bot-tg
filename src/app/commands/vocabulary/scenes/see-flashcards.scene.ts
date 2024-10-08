import { Apply, CreateScene } from '../../../../core';
import { TelegramContext } from '../../../../core/ctx.class';
import { ModifyParams } from '../../../../core/decorators/modify-params/modify-params.decorator';
import { CreateSelectButtonComposer } from '../../../../core/decorators/scene/composers';
import { Scene } from '../../../../core/decorators/scene/types';
import { CreateFinishReplyAction, SelectLanguageAction } from '../../../shared/actions';
import { StudyLanguageManaging } from '../../../shared/classes';
import { LanguageJsonFormat } from '../../../shared/constants';
import { IsLearningLanguageMiddleware } from '../../../shared/middlewares';
import { GetStudyLanguageManaging } from '../../../shared/modify-params';
import { toStringFlashcards } from '../../../shared/utils';
import { IsNotEmptyVocabularyMiddleware } from './shared/middlewares';

@CreateScene('vocabulary-see-flashcards-scene')
export class VocabularySeeFlashcardsScene implements Scene {

    @ModifyParams()
    start(ctx: TelegramContext, @GetStudyLanguageManaging() StudyLanguageManaging: StudyLanguageManaging ) {
        SelectLanguageAction(ctx, StudyLanguageManaging, true);
    }

    @CreateSelectButtonComposer('language', LanguageJsonFormat, true)
    @Apply({middlewares: [IsLearningLanguageMiddleware, IsNotEmptyVocabularyMiddleware], possibleErrors: []})
    afterSelectLanguage(ctx: TelegramContext) {
        CreateFinishReplyAction(ctx, toStringFlashcards(ctx.scene.states.vocabulary));
    }
}