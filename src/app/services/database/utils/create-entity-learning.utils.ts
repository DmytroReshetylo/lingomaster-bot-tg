import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { JSONLearning } from '../types/entity-learning.type';

export class CreateEntityLearning<T extends JSONLearning> {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column('json')
    json: T[] = [];
}