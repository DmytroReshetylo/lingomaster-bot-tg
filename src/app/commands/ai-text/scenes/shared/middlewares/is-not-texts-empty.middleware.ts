import { TelegramContext } from '../../../../../../core/ctx.class';
import { Languages } from '../../../../../../core/language-interface/enums';
import { translate } from '../../../../../../core/language-interface/translate.alghoritm';
import { StudyLanguageManaging } from '../../../../../shared/classes';

export function IsNotTextsEmptyMiddleware(ctx: TelegramContext) {
    if(!ctx.scene.states.StudyLanguageManaging) {
        ctx.scene.states.StudyLanguageManaging = new StudyLanguageManaging(ctx);
    }

    ctx.scene.states.language = translate(ctx.scene.states.language, Languages.en);

    ctx.scene.states.texts = ctx.scene.states.StudyLanguageManaging.getTexts(ctx.scene.states.language);

    if(!ctx.scene.states.texts.length) {
        return 'MIDDLEWARES.EMPTY_TEXTS';
    }

    return null;
}