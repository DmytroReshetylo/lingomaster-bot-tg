import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EntityNames } from '../../enums/entity-names.enum';
import { InterfaceLanguages, Languages } from '../../enums/languages.enum';
import { LearningLanguageEntity } from './learning-language.entity';

@Entity({ name: EntityNames.User })
export class UserEntity {
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

    @OneToMany(() => LearningLanguageEntity, entity => entity.user, {eager: true})
    learningLanguages!: LearningLanguageEntity[]
}