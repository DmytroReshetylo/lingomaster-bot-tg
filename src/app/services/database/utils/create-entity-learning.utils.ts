import { Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Languages } from '../../../../core/language-interface/enums';
import { Constructor } from '../../../../core/types';
import { User } from '../entities/user/user.entity';
import { EntityLearningType, JSONLearning } from '../types/entity-learning.type';

export function CreateEntityLearning<T extends JSONLearning>(entityName: keyof User) {
    class entity {
        @PrimaryGeneratedColumn()
        id!: number;

        @ManyToOne(() => User, user => user[entityName])
        user!: User;

        @Column('enum', {enum: Languages})
        language!: Languages;

        @Column('json')
        json!: T[];
    }

    return entity as any as Constructor<EntityLearningType<T>>;
}