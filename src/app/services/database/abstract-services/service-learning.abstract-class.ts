import { FindOptionsWhere, ObjectLiteral } from 'typeorm';
import { Languages } from '../../../../core/language-interface/enums';
import { similarityDetectorService } from '../../similarity-detector';
import { Constructor } from '../../../../core/types';
import { User } from '../entities/user/user.entity';
import { EntityLearningType } from '../types/entity-learning.type';
import { Service } from './service.abstract-class';

export abstract class ServiceLearning<
    T extends ObjectLiteral & { photoUrl: string | null },
    TT extends EntityLearningType<T>,
    KEY extends keyof T
> extends Service<TT> {
    private diffProperty: KEY;

    constructor(repository: Constructor<TT>, diffProperty: KEY) {
        super(repository);
        this.diffProperty = diffProperty;
    }

    async updateRecord(user: User, language: Languages, record: T) {
        const entity = await this.getEntity({ user, language } as any);

        if (!entity) return false;

        entity.json = entity.json.map((item) =>
            similarityDetectorService.detect(item[this.diffProperty], record[this.diffProperty]) ? record : item
        );

        await this.update({ user, language } as any, entity as any);

        return entity;
    }

    async updateFullRecords(user: User, language: Languages, records: T[]) {
        const entity = await this.getEntity({ user, language } as any);

        if (!entity) return false;

        entity.json = records;

        return await this.update({ user, language } as any, entity as any);
    }

    async addRecord(user: User, language: Languages, records: T[]) {
        const entity = await this.getEntity({ user, language } as any);

        if (!entity) return false;

        records = records.filter(
            (record) =>
                !entity.json.find((record2) =>
                    similarityDetectorService.detect(record2[this.diffProperty] as string, record[this.diffProperty] as string)
                )
        );

        entity.json = [...entity.json, ...records];

        await this.update({ user, language } as any, entity as any);

        return entity;
    }

    async removeRecord(user: User, language: Languages, words: string[]) {
        const entity = await this.getEntity({ user, language } as any);
        if (!entity) return false;

        entity.json = entity.json.filter(
            (record) =>
                !words.find((word) =>
                    similarityDetectorService.detect(word, record[this.diffProperty] as string)
                )
        ) as T[];

        await this.update({ user, language } as any, entity as any);

        return entity;
    }

    getJSON(entity: TT) {
        return entity.json as T[];
    }

    getDataDifferenceValue(data: T) {
        return data[this.diffProperty] as string;
    }
}
