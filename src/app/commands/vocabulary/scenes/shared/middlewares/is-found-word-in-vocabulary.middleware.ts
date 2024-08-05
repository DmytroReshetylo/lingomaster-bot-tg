import { Ctx } from '../../../../../../core/types';
import { Vocabulary } from '../../../../../services/database/vocabulary/vocabulary.entity';
import { similarityDetectorService } from '../../../../../services/similarity-detector';
import { getVocabulary } from '../utils';

export function IsFoundWordInVocabularyMiddleware(ctx: Ctx) {
    ctx.wizard.state.vocabulary = getVocabulary(ctx.session.vocabularies, ctx.wizard.state.language);

    ctx.wizard.state.id = (ctx.wizard.state.vocabulary as Vocabulary)
    .flashcards.findIndex(flashcard => similarityDetectorService.detect(flashcard.word, ctx.wizard.state.word))

    if(ctx.wizard.state.id === -1) {
        return 'MIDDLEWARES.WORD_NOT_FOUND';
    }

    return null;
}