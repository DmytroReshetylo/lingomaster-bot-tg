import { TelegramContext } from '../../../../../../core/ctx.class';
import { EntityNames } from '../../../../../services/database/entities/entity-names';
import { Vocabulary } from '../../../../../services/database/entities/vocabulary/vocabulary.entity';
import { similarityDetectorService } from '../../../../../services/similarity-detector';
import { getVocabulary } from '../utils';

export function IsFoundWordInVocabularyMiddleware(ctx: TelegramContext) {
    ctx.scene.states.vocabulary = getVocabulary(ctx.session[EntityNames.Vocabulary], ctx.scene.states.language);

    ctx.scene.states.id = (ctx.scene.states[EntityNames.Vocabulary] as Vocabulary)
    .json.findIndex(flashcard => similarityDetectorService.detect(flashcard.word, ctx.scene.states.word))

    if(ctx.scene.states.id === -1) {
        return 'MIDDLEWARES.WORD_NOT_FOUND';
    }

    return null;
}