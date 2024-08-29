import { TelegramContext } from '../../../core/ctx.class';
import { Vocabulary } from '../../services/database/entities/vocabulary/vocabulary.entity';
import { transformLanguageToJsonFormat } from '../utils';

export function IsLearningLanguageMiddleware(ctx: TelegramContext) {
    const findedLanguage = (ctx.session['vocabularies'] as Vocabulary[])
    .find(voc => transformLanguageToJsonFormat([voc.language])[0] === ctx.scene.states.language);

    if(!findedLanguage) {
        return 'MIDDLEWARES.YOU_DONT_LEARN_THE_LANGUAGE';
    }

    return null;
}