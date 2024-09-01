import { TelegramContext } from '../../../core/ctx.class';
import { ServiceLearning } from '../../services/database/abstract-services/service-learning.abstract-class';
import { StudyLanguages } from '../../services/database/entities/study-languages/study-language.entity';
import { EntityLearningType, JSONLearning } from '../../services/database/types/entity-learning.type';
import { StudyLanguageServicesSubscribers } from './study-language-services-subscribers';

export async function UpdateSessionJSONSubscriber<T extends JSONLearning>(
    ctx: TelegramContext, 
    service: ServiceLearning<T, EntityLearningType<T>, any>,
    studyLanguageEntity: StudyLanguages
) {
    const sessionName= StudyLanguageServicesSubscribers.get(service);

    if(!sessionName) {
        return;
    }

    (studyLanguageEntity as any)[sessionName as any] = await service.getSessionData({studyLanguages: {id: studyLanguageEntity.id}});
}