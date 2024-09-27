import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EntityNames } from '../../enums/entity-names.enum';
import { VocabularyEntity } from './vocabulary.entity';

@Entity({ name: EntityNames.Flashcard })
export class FlashcardEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => VocabularyEntity, entity => entity.flashcards)
    @JoinColumn()
    vocabulary!: FlashcardEntity;

    @Column({type: 'varchar', length: 150})
    word!: string;

    @Column({type: 'varchar', length: 150})
    translate!: string;

    @Column({type: 'varchar', length: 30, default: null})
    photoUrl!: string | null;

}