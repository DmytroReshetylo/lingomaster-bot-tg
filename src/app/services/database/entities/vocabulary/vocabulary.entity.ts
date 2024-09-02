import { BeforeInsert, BeforeUpdate, Entity, JoinColumn, OneToOne } from 'typeorm';
import { CreateEntityLearning } from '../entity-learning.abstract-class';
import { EntityNames } from '../entity-names';
import { StudyLanguages } from '../study-languages/study-language.entity';
import { Flashcard } from './types';

@Entity(EntityNames.Vocabulary)
export class Vocabulary extends CreateEntityLearning<Flashcard> {

    @OneToOne(() => StudyLanguages, studyLanguages => studyLanguages[EntityNames.Vocabulary])
    @JoinColumn()
    studyLanguages!: StudyLanguages;

    @BeforeInsert()
    @BeforeUpdate()
    regulateProgress() {
        this.json = this.json.map((flashcard) => {
            if(flashcard.progress > 10) {
                flashcard.progress = 10;
            }
            if(flashcard.progress < 0) {
                flashcard.progress = 0;
            }

            return flashcard;
        });
    }
}