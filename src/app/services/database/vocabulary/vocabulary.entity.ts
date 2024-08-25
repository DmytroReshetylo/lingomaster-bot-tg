import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Languages } from '../../../../core/language-interface/enums';
import { Flashcard } from './types';
import { User } from '../user/user.entity';

@Entity('vocabulary')
export class Vocabulary {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, user => user.vocabulary)
    user!: User;

    @Column('enum', {enum: Languages})
    language!: Languages;

    @Column('json')
    flashcards!: Flashcard[];

    @BeforeUpdate()
    regulateProgress() {
        this.flashcards = this.flashcards.map((flashcard) => {
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