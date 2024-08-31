import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Languages } from '../../../../../core/language-interface/enums';
import { AIText } from '../ai-text/text.entity';
import { EntityNames } from '../entity-names';
import { User } from '../user/user.entity';
import { Vocabulary } from '../vocabulary/vocabulary.entity';

@Entity(EntityNames.StudyLanguages)
export class StudyLanguages {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, user => user.studyLanguages)
    user!: User;

    @Column('enum', {enum: Languages})
    language!: Languages;

    @OneToOne(() => Vocabulary, vocabulary => vocabulary.studyLanguages, { eager: true, cascade: true, nullable: true })
    vocabularies?: Vocabulary;

    @OneToMany(() => AIText, text => text.studyLanguages, { eager: true, cascade: true, nullable: true })
    texts?: AIText[];
}