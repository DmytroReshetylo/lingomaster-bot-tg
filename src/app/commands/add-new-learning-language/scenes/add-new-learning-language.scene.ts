import { Apply, CreateScene } from '../../../../core';
import { TelegramContext } from '../../../../core/ctx.class';
import { ModifyParams } from '../../../../core/decorators/modify-params/modify-params.decorator';
import { CreateSelectButtonComposer } from '../../../../core/decorators/scene/composers';
import { Scene } from '../../../../core/decorators/scene/types';
import { Languages } from '../../../../core/language-interface/enums';
import { EntityNames } from '../../../services/database/entities/entity-names';
import { studyLanguageService } from '../../../services/database/entities/study-languages/study-language.service';
import { CreateFinishReplyAction, SelectLanguageAction } from '../../../shared/actions';
import { StudyLanguageManaging } from '../../../shared/classes';
import { LanguageJsonFormat } from '../../../shared/constants';
import { IsNotLearningLanguageMiddleware } from '../../../shared/middlewares';
import { GetStudyLanguageManaging, TransformLanguage } from '../../../shared/modify-params';
import { ApplyServicePartAction } from '../../../shared/part-actions';

@CreateScene('add-new-learning-language-scene')
export class AddNewLearningLanguageScene implements Scene {
    @Apply({middlewares: [], possibleErrors: []})
    @ModifyParams()
    async start(ctx: TelegramContext, @GetStudyLanguageManaging() StudyLanguageManaging: StudyLanguageManaging) {
        SelectLanguageAction(ctx, StudyLanguageManaging, false);
    }

    @CreateSelectButtonComposer('language', LanguageJsonFormat, true)
    @Apply({middlewares: [IsNotLearningLanguageMiddleware], possibleErrors: []})
    @ModifyParams()
    async afterSelectStudyLanguage(ctx: TelegramContext, @TransformLanguage('language') language: Languages) {
        await ApplyServicePartAction(ctx, studyLanguageService , 'add', {}, {user: ctx.session[EntityNames.User], language});

        CreateFinishReplyAction(ctx, 'STUDY_NEW_LANGUAGE.FINISHED', ctx.session[EntityNames.User].interfaceLanguage);
    }
}