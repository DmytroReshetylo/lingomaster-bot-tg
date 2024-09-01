import { Apply, CreateScene } from '../../../../core';
import { TelegramContext } from '../../../../core/ctx.class';
import { ModifyParams } from '../../../../core/decorators/modify-params/modify-params.decorator';
import { CreateSelectBigButtonComposer, CreateSelectButtonComposer } from '../../../../core/decorators/scene/composers';
import { Scene } from '../../../../core/decorators/scene/types';
import { Languages } from '../../../../core/language-interface/enums';
import { textService } from '../../../services/database/entities/ai-text/text.service';
import { EntityNames } from '../../../services/database/entities/entity-names';
import { CreateFinishReplyAction, CreateReplyAction, SelectLanguageAction } from '../../../shared/actions';
import { QueueOnDelete, StudyLanguageManaging } from '../../../shared/classes';
import { LanguageJsonFormat } from '../../../shared/constants';
import { IsLearningLanguageMiddleware } from '../../../shared/middlewares';
import { GetFromStates, GetQueueOnDelete, GetStudyLanguageManaging } from '../../../shared/modify-params';
import { ApplyServicePartAction, SendTextPartAction } from '../../../shared/part-actions';
import { ListTextsWithStepsPartAction } from './shared/part-actions';

@CreateScene('text-delete-scene')
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