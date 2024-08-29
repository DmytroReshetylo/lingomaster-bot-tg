import { FindOptionsWhere } from 'typeorm';
import { Languages } from '../../../core/language-interface/enums';
import { Constructor } from '../../../core/types';
import { similarityDetectorService } from '../similarity-detector';
import { ServiceWithJson } from './service-with-json.type';
import { Service } from './service.abstract-class';
import { User } from './user/user.entity';

export abstract class ServiceLearning<T extends ServiceWithJson, NAMEOBJECT extends keyof T, KEY extends keyof T[NAMEOBJECT][number]> extends Service<T> {
    private nameObject: NAMEOBJECT;
    private nameDifferenceProperty: KEY;

    constructor(repository: Constructor<T extends ServiceWithJson ? T : never>, nameObject: NAMEOBJECT, nameDifferenceProperty: KEY) {
        super(repository);

        this.nameObject = nameObject;
        this.nameDifferenceProperty = nameDifferenceProperty;
    }

    async updateRecord(user: User, language: Languages, record: T[NAMEOBJECT]) {
        const entity = await this.getEntity({user, language} as FindOptionsWhere<T>);

        if(!entity) {
            return false;
        }

        entity[this.nameObject][this.nameDifferenceProperty] = record;

        await this.update({user, language} as FindOptionsWhere<T>, entity);

        return entity;
    }

    async updateFullRecords(user: User, language: Languages, records: T[NAMEOBJECT][]) {
        const entity = await this.getEntity({user, language} as FindOptionsWhere<T>);

        if(!entity) {
            return false;
        }

        entity[this.nameObject] = records as T[NAMEOBJECT];

        return await this.update({user, language} as FindOptionsWhere<T>, entity);
    }

    async addRecord(user: User, language: Languages, records: T[NAMEOBJECT][]) {
        const entity = await this.getEntity({user, language} as FindOptionsWhere<T>);

        if(!entity) {
            return false;
        }

        records = records.filter(record =>
            !(entity[this.nameObject] as T[NAMEOBJECT][]).find(record2 => similarityDetectorService.detect(record2[this.nameDifferenceProperty], record[this.nameDifferenceProperty])
        ));

        entity[this.nameObject] = [...entity[this.nameObject], ...records] as T[NAMEOBJECT];

        await this.update({user, language} as FindOptionsWhere<T>, entity);

        return entity;
    }

    async removeRecord(user: User, language: Languages, words: string[]) {
        const entity = await this.getEntity({user, language} as FindOptionsWhere<T>);

        if(!entity) {
            return false;
        }

        entity[this.nameObject] = (entity[this.nameObject] as T[NAMEOBJECT][]).filter(record => !words.find(word => similarityDetectorService.detect(word, record[this.nameDifferenceProperty]))) as T[NAMEOBJECT];

        await this.update({user, language} as FindOptionsWhere<T>, entity);

        return entity;
    }

    getJSON(entity: T) {
        return entity[this.nameObject] as T[NAMEOBJECT][];
    }

    getDataDifferenceValue(data: T[NAMEOBJECT]) {
        return data[this.nameDifferenceProperty] as string;
    }
}