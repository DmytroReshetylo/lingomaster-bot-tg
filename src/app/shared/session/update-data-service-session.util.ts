import { ObjectLiteral } from 'typeorm';
import { TelegramContext } from '../../../core/ctx.class';
import { Service } from '../../services/database/abstract-services/service.abstract-class';
import { SessionSubscribers } from './update-session-subscribers';

export function UpdateSessionSubscribers<T extends ObjectLiteral>(ctx: TelegramContext, service: Service<T>, data: T | T[]) {
    const sessionName= SessionSubscribers.get(service);

    if(!sessionName) {
        return;
    }

    ctx.session[sessionName] = data;
}