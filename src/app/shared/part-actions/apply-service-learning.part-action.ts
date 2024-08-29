import { TelegramContext } from '../../../core/ctx.class';
import { Languages } from '../../../core/language-interface/enums';
import { ServiceLearning } from '../../services/database/service-learning.abstract-class';
import { ServiceWithJson } from '../../services/database/service-with-json.type';
import { User } from '../../services/database/user/user.entity';
import { photoManagerService } from '../../services/photo-manager/photo-manager.service';
import { PhotoManagerSubscribers } from '../../services/photo-manager/photo-manager.subscribers';
import { UpdateSessionJSONSubscriber } from '../session/update-data-service-json-session.util';
import { SessionSubscribers } from '../session/update-session-subscribers';

export type Actions<T> = {
    update: T,
    add: T[],
    remove: string[]
}

export async function ApplyServiceLearningPartAction<
    T,
    TT extends ServiceWithJson,
    K extends keyof Actions<T>,
    ENTITY extends Actions<T>[K]
>(ctx: TelegramContext, user: User, language: Languages, service: ServiceLearning<TT, any, any>, action: K, data: ENTITY) {
    let entity: TT | false = false;

    switch (action) {
        case 'update': {
            entity = await service.updateRecord(user, language, data as any);
            break;
        }
        case 'add': {
            entity = await service.addRecord(user, language, data as any);
            break;
        }
        case 'remove': {
            entity = await service.removeRecord(user, language, data as any);
            break;
        }
    }

    if (entity && PhotoManagerSubscribers.includes(service)) {
        photoManagerService.generatePhotoDescriptorsForUser(user, service, entity as any);
    }

    if (entity && SessionSubscribers.has(service)) {
        UpdateSessionJSONSubscriber(ctx, service, entity as any, language);
    }
}
