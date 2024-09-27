import { Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EntityNames } from '../../enums/entity-names.enum';
import { FlashcardEntity } from './flashcard.entity';
import { LearningLanguageEntity } from './learning-language.entity';

@Entity({ name: EntityNames.Vocabulary })
export class VocabularyEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @OneToOne(() => LearningLanguageEntity, entity => entity.vocabulary, {eager: true})
    @JoinColumn()
    learningLanguage!: LearningLanguageEntity;

    @OneToMany(() => FlashcardEntity, entity => entity.vocabulary, {eager: true})
    flashcards!: FlashcardEntity[]
}