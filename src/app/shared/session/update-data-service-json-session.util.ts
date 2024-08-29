import { TelegramContext } from '../../../core/ctx.class';
import { Languages } from '../../../core/language-interface/enums';
import { ServiceLearning } from '../../services/database/service-learning.abstract-class';
import { ServiceWithJson } from '../../services/database/service-with-json.type';
import { SessionSubscribers } from './update-session-subscribers';

export function UpdateSessionJSONSubscriber<T extends ServiceWithJson>(ctx: TelegramContext, service: ServiceLearning<T, any, any>, entity: T, language: Languages) {
    const sessionName= SessionSubscribers.get(service);

    if(!sessionName) {
        return;
    }

    const index: number = (ctx.session[sessionName] as T[]).findIndex(obj => obj.language === language);

    if(index === -1) {
        return;
    }

    ctx.session[sessionName][index] = entity;
}