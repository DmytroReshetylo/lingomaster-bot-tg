import { TelegramContext } from '../../../../../../core/ctx.class';
import { AIText } from '../../../../../services/database/entities/ai-text/text.entity';
import { EntityNames } from '../../../../../services/database/entities/entity-names';

export function IsNameAlreadySetMiddleware(ctx: TelegramContext) {
    const name = (ctx.session[EntityNames.StudyLanguages][EntityNames.Text] as AIText[]).find(text => text.associativeName === ctx.data);

    if(name) {
        return 'MIDDLEWARES.NAME_IS_ALREADY_SET';
    }

    return null;
}