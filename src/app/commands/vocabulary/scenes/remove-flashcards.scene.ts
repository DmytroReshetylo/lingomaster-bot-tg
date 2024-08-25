import { Apply, CreateScene } from '../../../../core';
import { TelegramContext } from '../../../../core/ctx.class';
import { ModifyParams } from '../../../../core/decorators/modify-params/modify-params.decorator';
import { CreateSelectButtonComposer, CreateTextComposer } from '../../../../core/decorators/scene/composers';
import { Scene } from '../../../../core/decorators/scene/types';
import { Languages } from '../../../../core/language-interface/enums';
import { vocabularyService } from '../../../services/database/vocabulary/vocabulary.service';
import { CreateFinishReplyAction, CreateReplyAction } from '../../../shared/actions';
import { SelectLanguageAction } from '../../../shared/actions';
import { VocabularyManaging } from '../../../shared/classes';
import { LanguageJsonFormat } from '../../../shared/constants';
import { IsLearningLanguageMiddleware } from '../../../shared/middlewares';
import { GetVocabularyManaging } from '../../../shared/modify-params';
import { TransformLanguage } from '../../../shared/modify-params';
import { getVocabulary } from './shared/utils';

@CreateScene('vocabulary-delete-flashcards-scene')
export class VocabularyRemoveFlashcardsScene implements Scene {

    @ModifyParams()
    start(ctx: TelegramContext, @GetVocabularyManaging() vocabularyManaging: VocabularyManaging ) {
        SelectLanguageAction(ctx, vocabularyManaging, true);
    }

    @CreateSelectButtonComposer('language', LanguageJsonFormat, true)
    @Apply({middlewares: [IsLearningLanguageMiddleware], possibleErrors: []})
    afterSelectLanguage(ctx: TelegramContext) {
        CreateReplyAction(
            ctx,
            'VOCABULARY.DEL_FLASHCARDS.ASK_INPUT',
            ctx.session['user'].interfaceLanguage,
            'button',
            ['BUTTONS.CANCEL']
        );
    }

    @CreateTextComposer('text', true)
    @Apply({middlewares: [], possibleErrors: []})
    @ModifyParams()
    async afterInputWords(ctx: TelegramContext, @TransformLanguage('language') language: Languages) {
        const words: string[] = ctx.scene.states.text.split('\n');

        const vocabulary = getVocabulary(ctx.session['vocabularies'], language);

        const newFlashcards = vocabulary.flashcards.filter(flashcard => !words.includes(flashcard.word));

        await vocabularyService.update(
            {user: ctx.session['user'], language},
            {flashcards: newFlashcards}
        );

        vocabulary.flashcards = newFlashcards;

        CreateFinishReplyAction(ctx, 'VOCABULARY.DEL_FLASHCARDS.FINISHED', ctx.session['user'].interfaceLanguage);
    }
}