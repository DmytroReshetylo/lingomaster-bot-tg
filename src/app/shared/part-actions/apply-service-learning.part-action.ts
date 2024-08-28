import { TelegramContext } from '../../../core/ctx.class';
import { Languages } from '../../../core/language-interface/enums';
import { ServiceLearning } from '../../services/database/service-learning.abstract-class';
import { User } from '../../services/database/user/user.entity';
import { photoManagerService } from '../../services/photo-manager/photo-manager.service';
import { PhotoManagerSubscribers } from '../../services/photo-manager/photo-manager.subscribers';
import { UpdateSessionJSONSubscriber } from '../session/update-data-service-json-session.util';
import { SessionSubscribers } from '../session/update-session-subscribers';

type Actions<T> = {
    update: T,
    add: T[],
    remove: string[]
}

export async function ApplyServiceLearningPartAction<
    T extends ServiceLearning<any, TT, any, any>,
    TT,
    K extends keyof Actions<TT>,
    ENTITY extends Actions<TT>[K]
>(ctx: TelegramContext, user: User, language: Languages, service: T, action: K, data: ENTITY) {
    let entity: T | false;

    switch (action) {
        case 'update': {
            entity = await service.updateRecord(user, language, data);

            break;
        }
        case 'add': {
            entity = await service.addRecord(user, language, data);

            break;
        }
        case 'remove': {
            entity = await service.removeRecord(user, language, data);

            break;
        }
    }

    if(entity && PhotoManagerSubscribers.includes(service)) {
        photoManagerService.generatePhotoDescriptorsForUser(user, service, entity);
    }

    if(entity && SessionSubscribers.has(service)) {
        UpdateSessionJSONSubscriber(ctx, service, entity, language);
    }

}