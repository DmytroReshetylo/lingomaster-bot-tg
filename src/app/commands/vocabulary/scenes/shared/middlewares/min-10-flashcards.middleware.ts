import { TelegramContext } from '../../../../../../core/ctx.class';
import { Languages } from '../../../../../../core/language-interface/enums';
import { translate } from '../../../../../../core/language-interface/translate.alghoritm';
import { EntityNames } from '../../../../../services/database/entities/entity-names';
import { getVocabulary } from '../utils';

export function MinTenFlashcardsMiddleware(ctx: TelegramContext) {
    ctx.scene.states.language = translate(ctx.scene.states.language, Languages.en);

    const vocabulary = getVocabulary(ctx.session[EntityNames.StudyLanguages], ctx.scene.states.language);

    if(vocabulary && vocabulary.json.length < 10) {
        return 'MIDDLEWARES.MUST_BE_MIN_10_FLASHCARDS';
    }

    return null;
}