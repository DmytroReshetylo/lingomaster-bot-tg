import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { InterfaceLanguages, Languages } from '../../../../../core/language-interface/enums';
import { EntityNames } from '../entity-names';
import { StudyLanguages } from '../study-languages/study-language.entity';

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

    @OneToMany(() => StudyLanguages, studyLanguages => studyLanguages.user)
    studyLanguages!: StudyLanguages[];
}