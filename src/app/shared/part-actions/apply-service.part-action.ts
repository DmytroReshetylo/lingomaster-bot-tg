import { FindOptionsWhere, ObjectLiteral } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { TelegramContext } from '../../../core/ctx.class';
import { Service } from '../../services/database/abstract-services/service.abstract-class';
import { photoManagerService } from '../../services/photo-manager/photo-manager.service';
import { PhotoManagerSubscribers } from '../../services/photo-manager/photo-manager.subscribers';
import { UpdateSessionSubscriber } from '../session/update-data-service-session.util';
import { SessionSubscribers } from '../session/update-session-subscribers';

export async function ApplyServicePartAction<T extends ObjectLiteral, TT extends Service<T>>(
    ctx: TelegramContext,
    service: TT,
    action: 'update' | 'add' | 'remove',
    conditions: FindOptionsWhere<T>,
    options: QueryDeepPartialEntity<T>
) {

    switch (action) {
        case 'update': {
            await service.update(conditions, options);

            break;
        }
        case 'add': {
            await service.insert(options);

            break;
        }
        case 'remove': {
            await service.delete(conditions);

            break;
        }
    }

    const findConditions: Record<string, any> = {};

    if(conditions.idTelegram) {
        findConditions.idTelegram = conditions.idTelegram;
    }

    if(conditions.user) {
        findConditions.user = conditions.user;
    }

    const data = await service.getSessionData(findConditions);
    
    if(data && PhotoManagerSubscribers.includes(service as any)) {
        photoManagerService.generatePhotoDescriptorsForUser(service as any, data as any);
    }

    if(SessionSubscribers.has(service)) {
        UpdateSessionSubscriber<T>(ctx, service, data);
    }

}