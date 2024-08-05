import { Ctx } from '../../../core/types';
import { Vocabulary } from '../../services/database/vocabulary/vocabulary.entity';
import { transformLanguageToJsonFormat } from '../utils';

export function IsNotLearningLanguageMiddleware(ctx: Ctx) {

    const findedLanguage = (ctx.session.vocabularies as Vocabulary[])
    .find(voc => transformLanguageToJsonFormat([voc.language])[0] === ctx.wizard.state.language);

    if(findedLanguage) {
        return 'MIDDLEWARES.YOU_ALREADY_LEARN_THE_LANGUAGE';
    }

    return null;
}