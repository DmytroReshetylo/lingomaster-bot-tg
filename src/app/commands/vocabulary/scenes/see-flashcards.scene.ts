import { Apply, CreateScene } from '../../../../core';
import { TelegramContext } from '../../../../core/ctx.class';
import { ModifyParams } from '../../../../core/decorators/modify-params/modify-params.decorator';
import { CreateSelectButtonComposer } from '../../../../core/decorators/scene/composers';
import { Scene } from '../../../../core/decorators/scene/types';
import { SelectLanguageAction } from '../../../shared/actions/select-learning-language.action';
import { VocabularyManaging } from '../../../shared/classes';
import { LanguageJsonFormat } from '../../../shared/constants';
import { IsLearningLanguageMiddleware } from '../../../shared/middlewares';
import { GetVocabularyManaging } from '../../../shared/modify-params';
import { getNavigationButtons, toStringFlashcards, transformLanguageToJsonFormat, transformToButtonActions } from '../../../shared/utils';
import { IsNotEmptyVocabularyMiddleware } from './shared/middlewares';

@CreateScene('vocabulary-see-flashcards-scene')
export class VocabularySeeFlashcardsScene implements Scene {

    @ModifyParams()
    start(ctx: TelegramContext, @GetVocabularyManaging() vocabularyManaging: VocabularyManaging ) {
        SelectLanguageAction(ctx, vocabularyManaging, true);
    }

    @CreateSelectButtonComposer('language', LanguageJsonFormat, true)
    @Apply({middlewares: [IsLearningLanguageMiddleware, IsNotEmptyVocabularyMiddleware], possibleErrors: []})
    afterSelectLanguage(ctx: TelegramContext) {
        ctx.reply(
            toStringFlashcards(ctx.scene.states.vocabulary),
            getNavigationButtons()
        );

        ctx.scene.leaveScene();
    }
}