import { TelegramContext } from '../../../../../../core/ctx.class';
import { Languages } from '../../../../../../core/language-interface/enums';
import { translate } from '../../../../../../core/language-interface/translate.alghoritm';
import { getVocabulary } from '../utils';

export function MinTenFlashcardsMiddleware(ctx: TelegramContext) {
    ctx.scene.states.language = translate(ctx.scene.states.language, Languages.en);

    if(getVocabulary(ctx.session['vocabularies'], ctx.scene.states.language).flashcards.length < 10) {
        return 'MIDDLEWARES.MUST_BE_MIN_10_FLASHCARDS';
    }

    return null;
}