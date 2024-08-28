import { ObjectLiteral } from 'typeorm';
import { User } from './user/user.entity';
import { Languages } from '../../../core/language-interface/enums';

export type ServiceJson = ObjectLiteral & {user: User, language: Languages};