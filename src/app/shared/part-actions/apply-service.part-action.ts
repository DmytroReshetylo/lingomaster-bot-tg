import { FindOptionsWhere, ObjectLiteral } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { TelegramContext } from '../../../core/ctx.class';
import { Service } from '../../services/database/abstract-services/service.abstract-class';
import { StudyLanguageServicesSubscribers } from '../session/study-language-services-subscribers';
import { UpdateDataSessionSubscribers } from '../session/update-data-session.util';
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

    if(SessionSubscribers.has(service) || StudyLanguageServicesSubscribers.has(service as any)) {
        UpdateDataSessionSubscribers(ctx);
    }

}