import { Apply, CreateScene } from '../../../../core';
import { TelegramContext } from '../../../../core/ctx.class';
import { ModifyParams } from '../../../../core/decorators/modify-params/modify-params.decorator';
import { CreateSelectBigButtonComposer, CreateSelectButtonComposer, CreateTextComposer } from '../../../../core/decorators/scene/composers';
import { Scene } from '../../../../core/decorators/scene/types';
import { Languages } from '../../../../core/language-interface/enums';
import { textGeneratorService, wordInfoService } from '../../../services/ai';
import { textService } from '../../../services/database/entities/ai-text/text.service';
import { EntityNames } from '../../../services/database/entities/entity-names';
import { CreateFinishReplyAction, CreateReplyAction, SelectLanguageAction } from '../../../shared/actions';
import { StudyLanguageManaging } from '../../../shared/classes';
import { LanguageJsonFormat } from '../../../shared/constants';
import { IsLearningLanguageMiddleware, IsNotPhohibitedSymbolsMiddleware } from '../../../shared/middlewares';
import { GetFromStates, GetStudyLanguageManaging, TransformLanguage } from '../../../shared/modify-params';
import { ApplyServicePartAction } from '../../../shared/part-actions';
import { AiErrorPossibleError } from '../../../shared/possible-errors';
import { TextManaging } from './shared/classes';
import { TextFormatJson } from './shared/constants';
import { TextFormat } from './shared/enums';
import { InputSplitMiddleware, IsNameAlreadySetMiddleware } from './shared/middlewares';
import { GetTextManaging } from './test-strategy/modify-params';

@CreateScene('text-add-scene')
export class TextAddTextScene implements Scene {

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
    @Apply({middlewares: [IsNameAlreadySetMiddleware], possibleErrors: []})
    afterInputName(ctx: TelegramContext) {
        CreateReplyAction(ctx, 'TEXT.ADD_TEXT.SELECT_FORMAT', ctx.session[EntityNames.User].interfaceLanguage, 'bigButton', [...TextFormatJson, 'BUTTONS.CANCEL']);
    }

    @CreateSelectBigButtonComposer('format', TextFormatJson, true)
    afterInputFormat(ctx: TelegramContext) {
        CreateReplyAction(ctx, 'TEXT.ADD_TEXT.ASK_TOPIC', ctx.session[EntityNames.User].interfaceLanguage, 'bigButton', ['BUTTONS.CANCEL']);
    }

    @CreateTextComposer('topic', false, true)
    afterInputTopic(ctx: TelegramContext) {
        CreateReplyAction(ctx, 'TEXT.ADD_TEXT.ASK_WORDS', ctx.session[EntityNames.User].interfaceLanguage, 'button', ['BUTTONS.CANCEL']);
    }

    @CreateTextComposer('words', true, false)
    @Apply({
        middlewares: [
            IsNotPhohibitedSymbolsMiddleware(['[', ']'], 'MIDDLEWARES.PROHIBITED_BRACKETS'),
            InputSplitMiddleware('\n', 10, 'MIDDLEWARES.MUST_BE_MIN_10_ADD_WORDS')
        ],
        possibleErrors: [AiErrorPossibleError]}
    )
    @ModifyParams()
    async afterInputText(
        ctx: TelegramContext,
        @GetFromStates('language') language: Languages,
        @GetFromStates('format') format: TextFormat,
        @GetFromStates('topic') topic: string,
        @GetFromStates('words') input: string,
        @GetTextManaging() textManaging: TextManaging
    ) {
        ctx.scene.states.words = input.split('\n');

        ctx.scene.states.text = await textGeneratorService.generateText(topic, format, ctx.scene.states.words, language);

        await ctx.reply(textManaging.deleteBrackets(ctx.scene.states.text));

        CreateReplyAction(ctx, 'QUESTIONS.ASK_ADD', ctx.session[EntityNames.User].interfaceLanguage, 'bigButton', ['REPLIES.YES', 'BUTTONS.CANCEL']);
    }

    @CreateSelectBigButtonComposer('confirmSave', ['REPLIES.YES'])
    @Apply({middlewares: [], possibleErrors: [AiErrorPossibleError]})
    @ModifyParams()
    async afterConfirmSave(
        ctx: TelegramContext,
        @TransformLanguage('language') language: Languages,
        @GetFromStates('name') associativeName: string,
        @GetFromStates('text') text: string,
        @GetStudyLanguageManaging() studyLanguageManaging: StudyLanguageManaging,
        @GetTextManaging() textManaging: TextManaging
    ) {
        const fragmentedText = textManaging.splitText(text);

        const flashcards = await wordInfoService.getTranslations(
            fragmentedText.map(value => value.word),
            ctx.session[EntityNames.User].nativeLanguage
        );

        await ApplyServicePartAction(ctx, textService, 'add', {}, {
            associativeName,
            text,
            fragmentedText: fragmentedText.map(value => value.sentence),
            json: flashcards,
            studyLanguages: studyLanguageManaging.getEntity(language)
        });

        CreateFinishReplyAction(ctx, 'TEXT.ADD_TEXT.FINISHED', ctx.session[EntityNames.User].interfaceLanguage);
    }
}