import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EntityNames } from '../../enums/entity-names.enum';
import { Languages } from '../../enums/languages.enum';
import { UserEntity } from './user.entity';
import { VocabularyEntity } from './vocabulary.entity';

@Entity({ name: EntityNames.LearningLanguage })
export class LearningLanguageEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => UserEntity, entity => entity.learningLanguages)
    @JoinColumn()
    user!: UserEntity;

    @Column('enum', {enum: Languages})
    language!: Languages;

    @OneToOne(() => VocabularyEntity, entity => entity.learningLanguage)
    vocabulary!: VocabularyEntity

}