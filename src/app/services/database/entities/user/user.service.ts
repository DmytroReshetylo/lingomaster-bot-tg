import { FindOptionsWhere } from 'typeorm';
import { SessionSubscribers } from '../../../../shared/session/update-session-subscribers';
import { Service } from '../../abstract-services/service.abstract-class';
import { EntityNames } from '../entity-names';
import { User } from './user.entity';

export class UserService extends Service<User> {
    constructor() {
        super(User);

        SessionSubscribers.set(this, EntityNames.User);
    }

    async getSessionData(conditions: FindOptionsWhere<User>) {
        return this.getEntity(conditions);
    }
}

export const userService = new UserService();