import { Languages } from '../../../../../../core/language-interface/enums';
import { translate } from '../../../../../../core/language-interface/translate.alghoritm';
import { Ctx } from '../../../../../../core/types';
import { getVocabulary } from '../utils';

export function MinTenFlashcardsMiddleware(ctx: Ctx) {
    ctx.wizard.state.language = translate(ctx.wizard.state.language, Languages.en);

    if(getVocabulary(ctx.session.vocabularies, ctx.wizard.state.language).flashcards.length < 10) {
        return 'MIDDLEWARES.MUST_BE_MIN_10_FLASHCARDS';
    }

    return null;
}