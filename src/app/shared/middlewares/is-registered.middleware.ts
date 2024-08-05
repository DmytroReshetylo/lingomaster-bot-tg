import { Ctx } from '../../../core/types';
import { userService } from '../../services/database/user/user.service';

export async function IsRegisteredMiddleware(ctx: Ctx) {
    const user = ctx.session.user || await userService.getAccount(String(ctx.message.from.id));

    if(!user) {
        return 'MIDDLEWARES.USER_NOT_REGISTERED';
    }

    return null;
}