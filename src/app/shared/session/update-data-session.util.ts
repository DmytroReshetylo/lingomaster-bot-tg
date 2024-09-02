import { TelegramContext } from '../../../core/ctx.class';
import { EntityNames } from '../../services/database/entities/entity-names';
import { User } from '../../services/database/entities/user/user.entity';
import { userService } from '../../services/database/entities/user/user.service';
import { SessionSubscribers } from './update-session-subscribers';

export async function UpdateDataSessionSubscribers(ctx: TelegramContext) {
    const user: null | User = await userService.getEntity({idTelegram: String(ctx.message.from.id)});

    if(!user) {
        return;
    }

    ctx.session[EntityNames.User] = user;

    for(const [service, sessionName] of SessionSubscribers) {
        if(userService === service) {
            continue;
        }

        ctx.session[sessionName] = await service.getEntities({user});
    }
}