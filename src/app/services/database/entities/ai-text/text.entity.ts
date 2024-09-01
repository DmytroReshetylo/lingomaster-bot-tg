import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CreateEntityLearning } from '../entity-learning.abstract-class';
import { EntityNames } from '../entity-names';
import { StudyLanguages } from '../study-languages/study-language.entity';
import { TextInfo } from './types';

@Entity(EntityNames.Text)
export class AIText extends CreateEntityLearning<TextInfo> {

    @Column('varchar', {length: 50})
    associativeName!: string;

    @Column('text')
    text!: string;

    @ManyToOne(() => StudyLanguages, studyLanguages => studyLanguages[EntityNames.Text])
    @JoinColumn()
    studyLanguages!: StudyLanguages;
}