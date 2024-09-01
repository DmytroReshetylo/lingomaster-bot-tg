import { Apply, CreateScene } from '../../../../core';
import { TelegramContext } from '../../../../core/ctx.class';
import { ModifyParams } from '../../../../core/decorators/modify-params/modify-params.decorator';
import { CreateSelectButtonComposer } from '../../../../core/decorators/scene/composers';
import { Scene } from '../../../../core/decorators/scene/types';
import { Languages } from '../../../../core/language-interface/enums';
import { SelectLanguageAction } from '../../../shared/actions';
import { QueueOnDelete, StudyLanguageManaging } from '../../../shared/classes';
import { LanguageJsonFormat } from '../../../shared/constants';
import { IsLearningLanguageMiddleware } from '../../../shared/middlewares';
import { GetFromStates, GetQueueOnDelete, GetStudyLanguageManaging } from '../../../shared/modify-params';
import { SendTextPartAction } from '../../../shared/part-actions';
import { ListTextsWithStepsPartAction } from './shared/part-actions';

@CreateScene('text-see-scene')
export class DeleteTextScene implements Scene {
    @ModifyParams()
    start(ctx: TelegramContext, @GetStudyLanguageManaging() studyLanguageManaging: StudyLanguageManaging) {
        SelectLanguageAction(ctx, studyLanguageManaging, true);
    }

    @CreateSelectButtonComposer('language', LanguageJsonFormat, true)
    @Apply({middlewares: [IsLearningLanguageMiddleware], possibleErrors: []})
    @ModifyParams()
    afterSelectLanguage(
        ctx: TelegramContext,
        @GetFromStates('language') language: Languages,
        @GetStudyLanguageManaging() studyLanguageManaging: StudyLanguageManaging,
        @GetQueueOnDelete() queueOnDelete: QueueOnDelete
    ) {
        const texts = studyLanguageManaging.getTexts(language);

        ListTextsWithStepsPartAction(ctx, texts, queueOnDelete);
    }

    @CreateSelectButtonComposer('textId', 'any', true)
    @ModifyParams()
    afterSelectTextID(
        ctx: TelegramContext,
        @GetFromStates('language') language: Languages,
        @GetFromStates('textId') textId: 'BUTTONS.NEXT' | 'BUTTONS.BACK' | number,
        @GetStudyLanguageManaging() studyLanguageManaging: StudyLanguageManaging,
        @GetQueueOnDelete() queueOnDelete: QueueOnDelete
    ) {
        const texts = studyLanguageManaging.getTexts(language);

        ListTextsWithStepsPartAction(ctx, texts, queueOnDelete, textId, async() => {
            await SendTextPartAction(ctx, texts[textId as number].text);

            ctx.scene.leaveScene();
        });
    }
}