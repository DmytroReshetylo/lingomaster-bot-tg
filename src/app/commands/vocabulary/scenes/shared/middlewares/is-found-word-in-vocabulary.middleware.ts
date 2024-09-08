import { TelegramContext } from '../../../../../../core/ctx.class';
import { Languages } from '../../../../../../core/language-interface/enums';
import { translate } from '../../../../../../core/language-interface/translate.alghoritm';
import { EntityNames } from '../../../../../services/database/entities/entity-names';
import { Vocabulary } from '../../../../../services/database/entities/vocabulary/vocabulary.entity';
import { similarityDetectorService } from '../../../../../services/similarity-detector';
import { getVocabulary } from '../utils';

export async function IsFoundWordInVocabularyMiddleware(ctx: TelegramContext) {
    ctx.scene.states.language = translate(ctx.scene.states.language, Languages.en);

    ctx.scene.states.vocabulary = getVocabulary(ctx.session[EntityNames.StudyLanguages], ctx.scene.states.language);

    ctx.scene.states.id = (ctx.scene.states.vocabulary as Vocabulary)
    .json.findIndex((flashcard) => similarityDetectorService.detect(flashcard.word, ctx.scene.states.word))

    if(ctx.scene.states.id === -1) {
        return 'MIDDLEWARES.WORD_NOT_FOUND';
    }

    return null;
}