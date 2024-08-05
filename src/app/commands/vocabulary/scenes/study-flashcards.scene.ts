import { Apply, CreateScene } from '../../../../core';
import { CreateSelectButtonComposer, CreateTextComposer } from '../../../../core/decorators/scene/composers';
import { Scene } from '../../../../core/decorators/scene/types';
import { Languages } from '../../../../core/language-interface/enums';
import { translate } from '../../../../core/language-interface/translate.alghoritm';
import { createBigButtonKeyboard, createButtonKeyboard } from '../../../../core/telegram-utils';
import { Ctx } from '../../../../core/types';
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

    start(ctx: Ctx) {
        ctx.reply(
            translate('INFO.CHOOSE_LANGUAGE', ctx.session.user.interfaceLanguage),
            createButtonKeyboard(
                transformToButtonActions([
                        ...transformLanguageToJsonFormat(getStudyLanguage(ctx.session.vocabularies)),
                        'BUTTONS.CANCEL'],
                    ctx.session.user.interfaceLanguage
                )
            )
        );

        ctx.wizard.next();
    }

    @CreateSelectButtonComposer('language', transformLanguageToJsonFormat(Object.values(Languages) as Languages[]), true)
    @Apply({middlewares: [IsLearningLanguageMiddleware, MinTenFlashcardsMiddleware], possibleErrors: []})
    afterSelectLanguage(ctx: Ctx) {
        ctx.reply(
            translate('INFO.SELECT_ACTION', ctx.session.user.interfaceLanguage),
            createButtonKeyboard(transformToButtonActions(Object.keys(studyLanguageActions), ctx.session.user.interfaceLanguage))
        );

        ctx.wizard.next();
    }

    @CreateSelectButtonComposer('model', Object.keys(studyLanguageActions), true)
    @Apply({middlewares: [], possibleErrors: []})
    async afterSelectModel(ctx: Ctx) {
        ctx.wizard.state.studyStrategy = new StudyFlashcardsStrategy(
            ctx.session.user,
            ctx.wizard.state.language,
            getVocabulary(ctx.session.vocabularies, ctx.wizard.state.language).flashcards,
            studyLanguageActions[ctx.wizard.state.model].showNextFlashcard
        );

        ctx.wizard.state.flashcard = ctx.wizard.state.studyStrategy.getNextFlashcard() as ShowFlashcardFormat;

        ctx.wizard.state.queueOnDelete = [];

        await ctx.reply(translate(
            'VOCABULARY.STUDY_LANGUAGE.STUDYING.STARTED', ctx.session.user.interfaceLanguage), 
            createButtonKeyboard(transformToButtonActions(['BUTTONS.CANCEL'], ctx.session.user.interfaceLanguage)
        ));

        studyLanguageActions[ctx.wizard.state.model].sendMessage(ctx);

        ctx.wizard.next();
    }

    @CreateTextComposer('answer', true)
    @Apply({middlewares: [], possibleErrors: []})
    async afterInputAnswer(ctx: Ctx) {
        ctx.wizard.state.queueOnDelete.push(ctx.update.message.message_id);

        let result = '';

        if(ctx.wizard.state.answer === ctx.wizard.state.flashcard.backSide) {
            result = translate('VOCABULARY.STUDY_LANGUAGE.STUDYING.CORRECT_ANSWER', ctx.session.user.interfaceLanguage);

            ctx.wizard.state.studyStrategy.changeProgress(ctx.wizard.state.flashcard.index, true);
        }
        else if(similarityDetectorService.detect(ctx.wizard.state.answer, ctx.wizard.state.flashcard.backSide)) {
            result = `${translate('VOCABULARY.STUDY_LANGUAGE.STUDYING.ALMOST_CORRECT_ANSWER', ctx.session.user.interfaceLanguage)} ${ctx.wizard.state.flashcard.backSide}`;

            ctx.wizard.state.studyStrategy.changeProgress(ctx.wizard.state.flashcard.index, true);
        }
        else {
            result = `${translate('VOCABULARY.STUDY_LANGUAGE.STUDYING.INCORRECT_ANSWER', ctx.session.user.interfaceLanguage)} ${ctx.wizard.state.flashcard.backSide}`;

            ctx.wizard.state.studyStrategy.changeProgress(ctx.wizard.state.flashcard.index, false);
        }

        ctx.wizard.state.flashcard = ctx.wizard.state.studyStrategy.getNextFlashcard() as ShowFlashcardFormat;

        const sentMessage = await ctx.reply(result);

        ctx.wizard.state.queueOnDelete.push(sentMessage.message_id);

        const queue = [...ctx.wizard.state.queueOnDelete];

        setTimeout(() => {
            deleteMessages(ctx, queue);
        }, 3000);

        ctx.wizard.state.queueOnDelete = [];

        studyLanguageActions[ctx.wizard.state.model].sendMessage(ctx);
    }

}