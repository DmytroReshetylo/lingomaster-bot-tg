import { TelegramContext } from '../../../core/ctx.class';
import { Languages } from '../../../core/language-interface/enums';
import { ServiceLearning } from '../../services/database/abstract-services/service-learning.abstract-class';
import { EntityLearningType } from '../../services/database/types/entity-learning.type';
import { SessionSubscribers } from './update-session-subscribers';

export function UpdateSessionJSONSubscriber<
    T extends {photoUrl: string | null},
    TT extends EntityLearningType<T>
>(
    ctx: TelegramContext, 
    service: ServiceLearning<T, any, any>, 
    json: T, 
    language: Languages
) {
    const sessionName= SessionSubscribers.get(service);

    if(!sessionName) {
        return;
    }

    const index: number = (ctx.session[sessionName] as TT[]).findIndex(obj => obj.language === language);

    if(index === -1) {
        return;
    }

    ctx.session[sessionName][index] = json;
}