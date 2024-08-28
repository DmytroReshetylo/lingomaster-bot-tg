import { TelegramContext } from '../../../core/ctx.class';
import { Service } from '../../services/database';
import { SessionSubscribers } from './update-session-subscribers';

export function UpdateSessionSubscriber<T>(ctx: TelegramContext, service: Service<T>, entity: T) {
    const sessionName= SessionSubscribers.get(service);

    if(!sessionName) {
        return;
    }

    ctx.session[sessionName] = entity;
}