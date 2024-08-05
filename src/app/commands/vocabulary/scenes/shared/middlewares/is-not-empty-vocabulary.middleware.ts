import { Languages } from '../../../../../../core/language-interface/enums';
import { translate } from '../../../../../../core/language-interface/translate.alghoritm';
import { Ctx } from '../../../../../../core/types';
import { getVocabulary } from '../utils';

export function IsNotEmptyVocabularyMiddleware(ctx: Ctx) {
    ctx.wizard.state.language = translate(ctx.wizard.state.language, Languages.en);

    ctx.wizard.state.vocabulary = getVocabulary(ctx.session.vocabularies, ctx.wizard.state.language);

    if(!ctx.wizard.state.vocabulary.flashcards.length) {
        return 'MIDDLEWARES.EMPTY_VOCABULARY';
    }

    return null;
}