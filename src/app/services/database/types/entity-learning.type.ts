import { ObjectLiteral } from 'typeorm';
import { Languages } from '../../../../core/language-interface/enums';
import { User } from '../entities/user/user.entity';

export type JSONLearning = ObjectLiteral & {photoUrl: string | null};

export type EntityLearningType<T extends JSONLearning> = {
    id: number;
    user: User;
    language: Languages;
    json: T[];
}