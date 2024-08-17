import { Apply, CreateScene } from '../../../../core';
import { TelegramContext } from '../../../../core/ctx.class';
import { CreateSelectButtonComposer, CreateTextComposer } from '../../../../core/decorators/scene/composers';
import { Scene } from '../../../../core/decorators/scene/types';
import { Languages } from '../../../../core/language-interface/enums';
import { translate } from '../../../../core/language-interface/translate.alghoritm';
import { createButtonKeyboard } from '../../../../core/telegram-utils';
import { similarityDetectorService } from '../../../services/similarity-detector';
import { IsLearningLanguageMiddleware } from '../../../shared/middlewares';
import { deleteMessages, transformLanguageToJsonFormat, transformToButtonActions } from '../../../shared/utils';
import { MinTenFlashcardsMiddleware } from './shared/middlewares';
import { getStudyLanguage, getVocabulary } from './shared/utils';
import { StudyFlashcardsStrategy } from './study-flashcards-strategy/study-flashcards.strategy';
import { studyLanguageActions } from './study-flashcards-strategy/utils';
import { ShowFlashcardFormat } from './study-flashcards-strategy/utils/types';

@CreateScene('vocabulary-study-language-scene')
export class VocabularyStudyFlashcardsScene implements Scene {

    start(ctx: TelegramContext) {
        ctx.reply(
            translate('INFO.CHOOSE_LANGUAGE', ctx.session['user'].interfaceLanguage),
            createButtonKeyboard(
                transformToButtonActions([
                        ...transformLanguageToJsonFormat(getStudyLanguage(ctx.session['vocabularies'])),
                        'BUTTONS.CANCEL'],
                    ctx.session['user'].interfaceLanguage
                )
            )
        );

        ctx.scene.nextAction();
    }

    @CreateSelectButtonComposer('language', transformLanguageToJsonFormat(Object.values(Languages) as Languages[]), true)
    @Apply({middlewares: [IsLearningLanguageMiddleware, MinTenFlashcardsMiddleware], possibleErrors: []})
    afterSelectLanguage(ctx: TelegramContext) {
        ctx.reply(
            translate('INFO.SELECT_ACTION', ctx.session['user'].interfaceLanguage),
            createButtonKeyboard(transformToButtonActions(Object.keys(studyLanguageActions), ctx.session['user'].interfaceLanguage))
        );

        ctx.scene.nextAction();
    }

    @CreateSelectButtonComposer('model', Object.keys(studyLanguageActions), true)
    @Apply({middlewares: [], possibleErrors: []})
    async afterSelectModel(ctx: TelegramContext) {
        ctx.scene.states.studyStrategy = new StudyFlashcardsStrategy(
            ctx.session['user'],
            ctx.scene.states.language,
            getVocabulary(ctx.session['vocabularies'], ctx.scene.states.language).flashcards,
            studyLanguageActions[ctx.scene.states.model].showNextFlashcard
        );

        ctx.scene.states.flashcard = ctx.scene.states.studyStrategy.getNextFlashcard() as ShowFlashcardFormat;

        ctx.scene.states.queueOnDelete = [];

        await ctx.reply(translate(
            'VOCABULARY.STUDY_LANGUAGE.STUDYING.STARTED', ctx.session['user'].interfaceLanguage), 
            createButtonKeyboard(transformToButtonActions(['BUTTONS.CANCEL'], ctx.session['user'].interfaceLanguage)
        ));

        studyLanguageActions[ctx.scene.states.model].sendMessage(ctx);

        ctx.scene.nextAction();
    }

    @CreateTextComposer('answer', true)
    @Apply({middlewares: [], possibleErrors: []})
    async afterInputAnswer(ctx: TelegramContext) {
        ctx.scene.states.queueOnDelete.push(ctx.message.message_id);

        let result = '';

        if(ctx.scene.states.answer === ctx.scene.states.flashcard.backSide) {
            result = translate('VOCABULARY.STUDY_LANGUAGE.STUDYING.CORRECT_ANSWER', ctx.session['user'].interfaceLanguage);

            ctx.scene.states.studyStrategy.changeProgress(ctx.scene.states.flashcard.index, true);
        }
        else if(similarityDetectorService.detect(ctx.scene.states.answer, ctx.scene.states.flashcard.backSide)) {
            result = `${translate('VOCABULARY.STUDY_LANGUAGE.STUDYING.ALMOST_CORRECT_ANSWER', ctx.session['user'].interfaceLanguage)} ${ctx.scene.states.flashcard.backSide}`;

            ctx.scene.states.studyStrategy.changeProgress(ctx.scene.states.flashcard.index, true);
        }
        else {
            result = `${translate('VOCABULARY.STUDY_LANGUAGE.STUDYING.INCORRECT_ANSWER', ctx.session['user'].interfaceLanguage)} ${ctx.scene.states.flashcard.backSide}`;

            ctx.scene.states.studyStrategy.changeProgress(ctx.scene.states.flashcard.index, false);
        }

        ctx.scene.states.flashcard = ctx.scene.states.studyStrategy.getNextFlashcard() as ShowFlashcardFormat;

        const sentMessage = await ctx.reply(result);

        ctx.scene.states.queueOnDelete.push(sentMessage.message_id);

        const queue = [...ctx.scene.states.queueOnDelete];

        setTimeout(() => {
            deleteMessages(ctx, queue);
        }, 3000);

        ctx.scene.states.queueOnDelete = [];

        studyLanguageActions[ctx.scene.states.model].sendMessage(ctx);
    }

}