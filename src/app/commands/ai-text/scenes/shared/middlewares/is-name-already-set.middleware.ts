import { TelegramContext } from '../../../../../../core/ctx.class';
import { Languages } from '../../../../../../core/language-interface/enums';
import { translate } from '../../../../../../core/language-interface/translate.alghoritm';
import { AIText } from '../../../../../services/database/entities/ai-text/text.entity';
import { StudyLanguageManaging } from '../../../../../shared/classes';

export function IsNameAlreadySetMiddleware(ctx: TelegramContext) {
    if(!ctx.scene.states.StudyLanguageManaging) {
        ctx.scene.states.StudyLanguageManaging = new StudyLanguageManaging(ctx);
    }

    ctx.scene.states.language = translate(ctx.scene.states.language, Languages.en);


    const name = (ctx.scene.states.StudyLanguageManaging.getTexts(ctx.scene.states.language) as AIText[]).find(text => text.associativeName === ctx.scene.states.name);

    if(name) {
        return 'MIDDLEWARES.NAME_IS_ALREADY_SET';
    }

    return null;
}