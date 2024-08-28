import { FindOptionsWhere } from 'typeorm';
import { Languages } from '../../../core/language-interface/enums';
import { Constructor } from '../../../core/types';
import { similarityDetectorService } from '../similarity-detector';
import { JSONProperties, ServiceWithJson } from './service-with-json.type';
import { Service } from './service.abstract-class';
import { User } from './user/user.entity';

export abstract class ServiceLearning<T extends ServiceWithJson, TT extends T[NAMEOBJECT][number] & JSONProperties, NAMEOBJECT extends keyof T, KEY extends keyof TT> extends Service<T> {
    private nameObject: NAMEOBJECT;
    private nameDifferenceProperty: KEY;

    constructor(repository: Constructor<T extends ServiceWithJson ? T : never>, nameObject: NAMEOBJECT, nameDifferenceProperty: KEY) {
        super(repository);

        this.nameObject = nameObject;
        this.nameDifferenceProperty = nameDifferenceProperty;
    }

    async updateRecord(user: User, language: Languages, record: TT) {
        const entity = await this.getEntity({user, language} as FindOptionsWhere<T>);

        if(!entity) {
            return false;
        }

        entity[this.nameObject][this.nameDifferenceProperty] = record;

        await this.update({user, language} as FindOptionsWhere<T>, entity);

        return entity;
    }

    async updateFullRecords(user: User, language: Languages, records: TT[]) {
        const entity = await this.getEntity({user, language} as FindOptionsWhere<T>);

        if(!entity) {
            return false;
        }

        entity[this.nameObject] = records as T[NAMEOBJECT];

        return await this.update({user, language} as FindOptionsWhere<T>, entity);
    }

    async addRecord(user: User, language: Languages, records: TT[]) {
        const entity = await this.getEntity({user, language} as FindOptionsWhere<T>);

        if(!entity) {
            return false;
        }

        records = records.filter(record =>
            !(entity[this.nameObject] as TT[]).find(record2 => similarityDetectorService.detect(record2[this.nameDifferenceProperty], record[this.nameDifferenceProperty])
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

        entity[this.nameObject] = (entity[this.nameObject] as TT[]).filter(record => !words.find(word => similarityDetectorService.detect(word, record[this.nameDifferenceProperty]))) as T[NAMEOBJECT];

        await this.update({user, language} as FindOptionsWhere<T>, entity);

        return entity;
    }

    getJSON(entity: T) {
        return entity[this.nameObject] as TT[];
    }

    getDataDifferenceValue(data: TT) {
        return data[this.nameDifferenceProperty] as string;
    }
}