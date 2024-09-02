import { TelegramContext } from '../../../core/ctx.class';
import { EntityNames } from '../../services/database/entities/entity-names';
import { userService } from '../../services/database/entities/user/user.service';

export async function IsRegisteredMiddleware(ctx: TelegramContext) {
    const user = ctx.session[EntityNames.User] || await userService.getEntity({idTelegram: String(ctx.message.from.id)});

    if(!user) {
        return 'MIDDLEWARES.USER_NOT_REGISTERED';
    }

    return null;
}