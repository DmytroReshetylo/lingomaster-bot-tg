import { TelegramContext } from '../../../../core/ctx.class';
import { ModifyParams } from '../../../../core/decorators/modify-params/modify-params.decorator';
import { Scene } from '../../../../core/decorators/scene/types';
import { InterfaceLanguages } from '../../../../core/language-interface/enums';
import { CreateSelectButtonComposer } from '../../../../core/decorators/scene/composers';
import { vocabularyService } from '../../../services/database/vocabulary/vocabulary.service';
import { CreateFinishReplyAction } from '../../../shared/actions';
import { SelectLanguageAction } from '../../../shared/actions';
import { VocabularyManaging } from '../../../shared/classes';
import { LanguageJsonFormat } from '../../../shared/constants';
import { IsNotLearningLanguageMiddleware } from '../../../shared/middlewares';
import { GetVocabularyManaging } from '../../../shared/modify-params';
import { TransformLanguage } from '../../../shared/modify-params';
import { Apply, CreateScene } from '../../../../core';

@CreateScene('vocabulary-study-new-language-scene')
export class VocabularyStudyNewLanguageScene implements Scene {

    @Apply({middlewares: [], possibleErrors: []})
    @ModifyParams()
    async start(ctx: TelegramContext, @GetVocabularyManaging() vocabularyManaging: VocabularyManaging) {
        SelectLanguageAction(ctx, vocabularyManaging, false);
    }

    @CreateSelectButtonComposer('language', LanguageJsonFormat, true)
    @Apply({middlewares: [IsNotLearningLanguageMiddleware], possibleErrors: []})
    @ModifyParams()
    async afterSelectStudyLanguage(ctx: TelegramContext, @TransformLanguage('language') language: InterfaceLanguages) {
        await vocabularyService.insert({
            user: ctx.session['user'],
            language,
            flashcards: []
        });

        ctx.session['vocabularies'] = await vocabularyService.getEntities({user: ctx.session['user']});

        CreateFinishReplyAction(ctx, 'VOCABULARY.STUDY_NEW_LANGUAGE.FINISHED', ctx.session['user'].interfaceLanguage);
    }

}