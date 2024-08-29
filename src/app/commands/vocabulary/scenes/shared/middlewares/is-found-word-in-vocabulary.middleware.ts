import { TelegramContext } from '../../../../../../core/ctx.class';
import { Vocabulary } from '../../../../../services/database/vocabulary/vocabulary.entity';
import { similarityDetectorService } from '../../../../../services/similarity-detector';
import { getVocabulary } from '../utils';

export function IsFoundWordInVocabularyMiddleware(ctx: TelegramContext) {
    ctx.scene.states.vocabulary = getVocabulary(ctx.session['vocabularies'], ctx.scene.states.language);

    ctx.scene.states.id = (ctx.scene.states['vocabularies'] as Vocabulary)
    .flashcards.findIndex(flashcard => similarityDetectorService.detect(flashcard.word, ctx.scene.states.word))

    if(ctx.scene.states.id === -1) {
        return 'MIDDLEWARES.WORD_NOT_FOUND';
    }

    return null;
}