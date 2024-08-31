import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CreateEntityLearning } from '../../utils/create-entity-learning.utils';
import { EntityNames } from '../entity-names';
import { StudyLanguages } from '../study-languages/study-language.entity';
import { Flashcard } from '../vocabulary/types';

@Entity(EntityNames.Text)
export class AIText extends CreateEntityLearning<Flashcard> {

    @Column('varchar', {length: 50})
    associativeName!: string;

    @Column('text')
    text!: string;

    @ManyToOne(() => StudyLanguages, studyLanguages => studyLanguages[EntityNames.Text])
    @JoinColumn()
    studyLanguages!: StudyLanguages;
}