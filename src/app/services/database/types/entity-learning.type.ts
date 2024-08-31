import { ObjectLiteral } from 'typeorm';
import { StudyLanguages } from '../entities/study-languages/study-language.entity';

export type JSONLearning = ObjectLiteral & {photoUrl: string | null};

export type EntityLearningType<T extends JSONLearning> = {
    id: number;
    studyLanguages: StudyLanguages;
    json: T[];
}