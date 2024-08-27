import { Service } from '../service.abstract-classes';
import { User } from './user.entity';

export class UserService extends Service<User> {
    constructor() {
        super(User);
    }
}

export const userService = new UserService();