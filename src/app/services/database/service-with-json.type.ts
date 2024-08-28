import { ObjectLiteral } from 'typeorm';
import { User } from './user/user.entity';
import { Languages } from '../../../core/language-interface/enums';

export type ServiceWithJson = ObjectLiteral & {user: User, language: Languages};

export type JSONProperties = {photoUrl: string};