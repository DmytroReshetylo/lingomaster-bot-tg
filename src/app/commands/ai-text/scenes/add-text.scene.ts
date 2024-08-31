import { Apply, CreateScene } from '../../../../core';
import { TelegramContext } from '../../../../core/ctx.class';
import { ModifyParams } from '../../../../core/decorators/modify-params/modify-params.decorator';
import { CreateSelectBigButtonComposer, CreateSelectButtonComposer, CreateTextComposer } from '../../../../core/decorators/scene/composers';
import { Scene } from '../../../../core/decorators/scene/types';
import { Languages } from '../../../../core/language-interface/enums';
import { textGeneratorService } from '../../../services/ai';
import { textService } from '../../../services/database/entities/ai-text/text.service';
import { EntityNames } from '../../../services/database/entities/entity-names';
import { CreateErrorReplyAction, CreateFinishReplyAction, CreateReplyAction, SelectLanguageAction } from '../../../shared/actions';
import { StudyLanguageManaging } from '../../../shared/classes';
import { LanguageJsonFormat } from '../../../shared/constants';
import { IsLearningLanguageMiddleware } from '../../../shared/middlewares';
import { GetFromStates, GetStudyLanguageManaging, TransformLanguage } from '../../../shared/modify-params';
import { ApplyServicePartAction } from '../../../shared/part-actions';
import { TextFormatJson } from './shared/constants';
import { TextFormat } from './shared/enums';

@CreateScene('text-add-scene')
export class AddTextScene implements Scene {

    @ModifyParams()
    start(ctx: TelegramContext, @GetStudyLanguageManaging() studyLanguageManaging: StudyLanguageManaging) {
        SelectLanguageAction(ctx, studyLanguageManaging, true);
    }

    @CreateSelectButtonComposer('language', LanguageJsonFormat, true)
    @Apply({middlewares: [IsLearningLanguageMiddleware], possibleErrors: []})
    afterSelectLanguage(ctx: TelegramContext) {
        CreateReplyAction(ctx, 'TEXT.ADD_TEXT.ASK_NAME', ctx.session[EntityNames.User].interfaceLanguage, 'bigButton', ['BUTTONS.CANCEL']);
    }

    @CreateTextComposer('name', false, true)
    afterInputName(ctx: TelegramContext) {
        CreateReplyAction(ctx, 'TEXT.ADD_TEXT.SELECT_FORMAT', ctx.session[EntityNames.User].interfaceLanguage, 'bigButton', [...TextFormatJson, 'BUTTONS.CANCEL']);
    }

    @CreateSelectBigButtonComposer('format', [], true)
    afterInputFormat(ctx: TelegramContext) {
        CreateReplyAction(ctx, 'TEXT.ADD_TEXT.ASK_TOPIC', ctx.session[EntityNames.User].interfaceLanguage, 'bigButton', ['BUTTONS.CANCEL']);
    }

    @CreateTextComposer('topic', false, true)
    afterInputTopic(ctx: TelegramContext) {
        CreateReplyAction(ctx, 'TEXT.ADD_TEXT.ASK_WORDS', ctx.session[EntityNames.User].interfaceLanguage, 'button', ['BUTTONS.CANCEL']);
    }

    @CreateTextComposer('words', true, false)
    @Apply({middlewares: [], possibleErrors: []})
    @ModifyParams()
    async afterInputText(
        ctx: TelegramContext,
        @TransformLanguage('language') language: Languages,
        @GetFromStates('format') format: TextFormat,
        @GetFromStates('topic') topic: string,
        @GetFromStates('words') input: string
    ) {
        const words = input.split('\n');

        ctx.scene.states.text = await textGeneratorService.generateText(topic, format, words, language);

        if(!ctx.scene.states.text) {
            CreateErrorReplyAction(ctx, 'MIDDLEWARES.AI_ERROR');

            return;
        }

        CreateReplyAction(ctx, 'TEXT.ADD_TEXT.PROMPT_SAVE', ctx.session[EntityNames.User].interfaceLanguage, 'button', ['REPLIES.YES', 'BUTTONS.CANCEL']);
    }

    @CreateSelectBigButtonComposer('confirmSave', ['REPLIES.YES'])
    @Apply({middlewares: [], possibleErrors: []})
    @ModifyParams()
    async afterConfirmSave(
        ctx: TelegramContext,
        @TransformLanguage('language') language: Languages,
        @GetFromStates('name') associativeName: string,
        @GetFromStates('text') text: string,
        @GetStudyLanguageManaging() studyLanguageManaging: StudyLanguageManaging
    ) {
        await ApplyServicePartAction(ctx, textService, 'add', {}, {associativeName, text, json: []});

        CreateFinishReplyAction(ctx, 'TEXT.ADD_TEXT.FINISHED', ctx.session[EntityNames.User].interfaceLanguage);
    }
}