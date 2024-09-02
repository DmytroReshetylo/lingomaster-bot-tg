import { TelegramContext } from '../../../core/ctx.class';
import { ServiceLearning } from '../../services/database/abstract-services/service-learning.abstract-class';
import { StudyLanguages } from '../../services/database/entities/study-languages/study-language.entity';
import { EntityLearningType, JSONLearning } from '../../services/database/types/entity-learning.type';
import { photoManagerService } from '../../services/photo-manager/photo-manager.service';
import { PhotoManagerSubscribers } from '../../services/photo-manager/photo-manager.subscribers';
import { StudyLanguageServicesSubscribers } from '../session/study-language-services-subscribers';
import { UpdateSessionJSONSubscriber } from '../session/update-data-service-json-session.util';

export type Actions<T> = {
    update: T,
    add: T[],
    remove: string[]
}

export async function ApplyServiceLearningPartAction<
    T extends JSONLearning,
    K extends keyof Actions<T>,
    ENTITY extends Actions<T>[K]
>(ctx: TelegramContext, studyLanguageEntity: StudyLanguages, idRow: number, service: ServiceLearning<T, EntityLearningType<T>, any>, action: K, data: ENTITY) {
    let entity: EntityLearningType<T> | false = false;

    switch (action) {
        case 'update': {
            entity = await service.updateRecord({id: idRow}, data as any);
            break;
        }
        case 'add': {
            entity = await service.addRecord({id: idRow}, data as any);
            break;
        }
        case 'remove': {
            entity = await service.removeRecord({id: idRow}, data as any);
            break;
        }
    }

    if (entity && PhotoManagerSubscribers.includes(service)) {
        photoManagerService.generatePhotoDescriptorsForUser(service, entity);
    }

    if (StudyLanguageServicesSubscribers.has(service)) {
        await UpdateSessionJSONSubscriber(ctx, service, studyLanguageEntity);
    }
}
