import { TelegramContext } from '../../../core/ctx.class';
import { EntityNames } from '../../services/database/entities/entity-names';
import { StudyLanguages } from '../../services/database/entities/study-languages/study-language.entity';
import { transformLanguageToJsonFormat } from '../utils';

export function IsNotLearningLanguageMiddleware(ctx: TelegramContext) {

    const findedLanguage = (ctx.session[EntityNames.StudyLanguages] as StudyLanguages[])
    .find(voc => transformLanguageToJsonFormat([voc.language])[0] === ctx.scene.states.language);

    if(findedLanguage) {
        return 'MIDDLEWARES.YOU_ALREADY_LEARN_THE_LANGUAGE';
    }

    return null;
}