import { TelegramContext } from '../../../../../../core/ctx.class';
import { Languages } from '../../../../../../core/language-interface/enums';
import { translate } from '../../../../../../core/language-interface/translate.alghoritm';
import { EntityNames } from '../../../../../services/database/entities/entity-names';
import { getVocabulary } from '../utils';

export function IsNotEmptyVocabularyMiddleware(ctx: TelegramContext) {
    ctx.scene.states.language = translate(ctx.scene.states.language, Languages.en);

    ctx.scene.states.vocabulary = getVocabulary(ctx.session[EntityNames.StudyLanguages], ctx.scene.states.language);

    if(!ctx.scene.states.vocabulary.json.length) {
        return 'MIDDLEWARES.EMPTY_VOCABULARY';
    }

    return null;
}