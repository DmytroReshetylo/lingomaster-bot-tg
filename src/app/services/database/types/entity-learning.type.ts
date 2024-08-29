import { Languages } from '../../../../core/language-interface/enums';
import { User } from '../entities/user/user.entity';

export type EntityLearningType<T extends {photoUrl: string | null}> = {
    id: number;
    user: User;
    language: Languages;
    json: T[];
}