
import { SessionSubscribers } from '../../../shared/session/update-session-subscribers';
import { Service } from '../service.abstract-class';
import { User } from './user.entity';

export class UserService extends Service<User> {
    constructor() {
        super(User);

        SessionSubscribers.set(this, 'user');
    }
}

export const userService = new UserService();