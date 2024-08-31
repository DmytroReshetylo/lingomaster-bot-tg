import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { InterfaceLanguages, Languages } from '../../../../../core/language-interface/enums';
import { EntityNames } from '../entity-names';
import { Story } from '../story/story.entity';
import { Vocabulary } from '../vocabulary/vocabulary.entity';

@Entity(EntityNames.User)
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column('bigint')
    idTelegram!: string;

    @Column('enum', {enum: Languages})
    interfaceLanguage!: InterfaceLanguages;

    @Column('enum', {enum: Languages})
    nativeLanguage!: Languages;

    @Column('varchar', {length: 50})
    name!: string;

    @OneToMany(() => Vocabulary, vocabulary => vocabulary.user)
    vocabularies!: Vocabulary[];

    @OneToMany(() => Story, story => story.user)
    stories!: Story[];
}