import { Apply, CreateScene } from '../../../../core';
import { TelegramContext } from '../../../../core/ctx.class';
import { ModifyParams } from '../../../../core/decorators/modify-params/modify-params.decorator';
import { CreateSelectButtonComposer } from '../../../../core/decorators/scene/composers';
import { Scene } from '../../../../core/decorators/scene/types';
import { Languages } from '../../../../core/language-interface/enums';
import { AIText } from '../../../services/database/entities/ai-text/text.entity';
import { SelectLanguageAction } from '../../../shared/actions';
import { QueueOnDelete, StudyLanguageManaging } from '../../../shared/classes';
import { LanguageJsonFormat } from '../../../shared/constants';
import { IsLearningLanguageMiddleware } from '../../../shared/middlewares';
import { GetFromStates, GetQueueOnDelete, GetStudyLanguageManaging, TransformIfNumber } from '../../../shared/modify-params';
import { SendTextPartAction } from '../../../shared/part-actions';
import { TextManaging } from './shared/classes';
import { IsNotTextsEmptyMiddleware } from './shared/middlewares';
import { ListTextsWithStepsPartAction } from './shared/part-actions';
import { GetTextManaging } from './test-strategy/modify-params';

@CreateScene('text-see-scene')
export class TextSeeTextScene implements Scene {
    @ModifyParams()
    start(ctx: TelegramContext, @GetStudyLanguageManaging() studyLanguageManaging: StudyLanguageManaging) {
        SelectLanguageAction(ctx, studyLanguageManaging, true);
    }

    @CreateSelectButtonComposer('language', LanguageJsonFormat, true)
    @Apply({middlewares: [IsLearningLanguageMiddleware, IsNotTextsEmptyMiddleware], possibleErrors: []})
    @ModifyParams()
    afterSelectLanguage(
        ctx: TelegramContext,
        @GetFromStates('language') language: Languages,
        @GetStudyLanguageManaging() studyLanguageManaging: StudyLanguageManaging,
        @GetFromStates('texts') texts: AIText[],
        @GetQueueOnDelete() queueOnDelete: QueueOnDelete
    ) {
        ListTextsWithStepsPartAction(ctx, texts, queueOnDelete);
    }

    @CreateSelectButtonComposer('textId', 'any', true)
    @ModifyParams()
    afterSelectTextID(
        ctx: TelegramContext,
        @GetFromStates('language') language: Languages,
        @TransformIfNumber('textId') textId: 'BUTTONS.NEXT' | 'BUTTONS.BACK' | number,
        @GetFromStates('texts') texts: AIText[],
        @GetTextManaging() textManaging: TextManaging,
        @GetStudyLanguageManaging() studyLanguageManaging: StudyLanguageManaging,
        @GetQueueOnDelete() queueOnDelete: QueueOnDelete
    ) {
        ListTextsWithStepsPartAction(ctx, texts, queueOnDelete, textId, async() => {
            await SendTextPartAction(ctx, textManaging, texts.find(text => text.id === textId)!.text);

            ctx.scene.leaveScene();
        });
    }
}