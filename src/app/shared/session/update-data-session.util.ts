import { TelegramContext } from '../../../core/ctx.class';
import { User } from '../../services/database/user/user.entity';
import { userService } from '../../services/database/user/user.service';
import { SessionSubscribers } from './update-session-subscribers';

export async function UpdateDataSessionSubscribers(ctx: TelegramContext) {
    const user: null | User = await userService.getEntity({idTelegram: String(ctx.message.from.id)});

    if(!user) {
        return;
    }

    ctx.session['user'] = user;

    for(const [service, sessionName] of SessionSubscribers) {
        if(userService === service) {
            continue;
        }

        ctx.session[sessionName] = await service.getEntities({user});
    }
}