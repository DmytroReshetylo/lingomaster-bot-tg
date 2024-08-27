import { TelegramContext } from '../../../core/ctx.class';
import { userService } from '../../services/database/user/user.service';

export async function IsRegisteredMiddleware(ctx: TelegramContext) {
    const user = ctx.session['user'] || await userService.getEntity({idTelegram: String(ctx.message.from.id)});

    if(!user) {
        return 'MIDDLEWARES.USER_NOT_REGISTERED';
    }

    return null;
}