import { FindOptionsWhere } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { TelegramContext } from '../../../core/ctx.class';
import { Languages } from '../../../core/language-interface/enums';
import { Service } from '../../services/database';
import { photoManagerService } from '../../services/photo-manager/photo-manager.service';
import { UpdateSessionSubscriber } from '../session/update-data-service-session.util';
import { SessionSubscribers } from '../session/update-session-subscribers';

export async function ApplyServiceLearningPartAction<T, TT extends Service<T>>(
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

    conditions = {...conditions, ...options};

    const entity = await service.getEntity(conditions);

    if(entity && SessionSubscribers.has(service)) {
        UpdateSessionSubscriber(ctx, service, entity);
    }

}