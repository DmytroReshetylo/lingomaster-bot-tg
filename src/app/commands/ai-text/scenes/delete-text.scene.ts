import { Apply, CreateScene } from '../../../../core';
import { TelegramContext } from '../../../../core/ctx.class';
import { ModifyParams } from '../../../../core/decorators/modify-params/modify-params.decorator';
import { CreateSelectBigButtonComposer, CreateSelectButtonComposer } from '../../../../core/decorators/scene/composers';
import { Scene } from '../../../../core/decorators/scene/types';
import { Languages } from '../../../../core/language-interface/enums';
import { AIText } from '../../../services/database/entities/ai-text/text.entity';
import { textService } from '../../../services/database/entities/ai-text/text.service';
import { EntityNames } from '../../../services/database/entities/entity-names';
import { CreateFinishReplyAction, CreateReplyAction, SelectLanguageAction } from '../../../shared/actions';
import { QueueOnDelete, StudyLanguageManaging } from '../../../shared/classes';
import { LanguageJsonFormat } from '../../../shared/constants';
import { IsLearningLanguageMiddleware } from '../../../shared/middlewares';
import { GetFromStates, GetQueueOnDelete, GetStudyLanguageManaging, TransformIfNumber } from '../../../shared/modify-params';
import { ApplyServicePartAction, SendTextPartAction } from '../../../shared/part-actions';
import { TextManaging } from './shared/classes';
import { IsNotTextsEmptyMiddleware } from './shared/middlewares';
import { ListTextsWithStepsPartAction } from './shared/part-actions';
import { GetTextManaging } from './test-strategy/modify-params';

@CreateScene('text-delete-scene')
export class TextDeleteTextScene implements Scene {
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
        @GetStudyLanguageManaging() studyLanguageManaging: StudyLanguageManaging,
        @GetTextManaging() textManaging: TextManaging,
        @GetQueueOnDelete() queueOnDelete: QueueOnDelete
    ) {
        ListTextsWithStepsPartAction(ctx, texts, queueOnDelete, textId, async() => {
            await SendTextPartAction(ctx, textManaging, texts.find(text => text.id === textId)!.text);

            CreateReplyAction(ctx, 'QUESTIONS.ASK_DEL', ctx.session[EntityNames.User].interfaceLanguage, 'bigButton', ['REPLIES.YES', 'BUTTONS.CANCEL']);
        });
    }

    @CreateSelectBigButtonComposer('confirmDelete', ['REPLIES.YES'])
    @Apply({middlewares: [], possibleErrors: []})
    @ModifyParams()
    async afterConfirmDelete(ctx: TelegramContext,  @GetFromStates('textId') textId: number) {
        await ApplyServicePartAction(ctx, textService, 'remove', {id: textId}, {});

        CreateFinishReplyAction(ctx, 'TEXT.DEL_TEXT.FINISHED', ctx.session[EntityNames.User].interfaceLanguage);
    }
}