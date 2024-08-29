import { BeforeInsert, BeforeUpdate, Entity } from 'typeorm';
import { CreateEntityLearning } from '../../utils/create-entity-learning.utils';
import { Flashcard } from './types';

@Entity('vocabulary')
export class Vocabulary extends CreateEntityLearning<Flashcard>('vocabulary') {
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