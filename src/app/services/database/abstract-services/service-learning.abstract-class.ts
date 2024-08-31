import { Constructor } from '../../../../core/types';
import { similarityDetectorService } from '../../similarity-detector';
import { StudyLanguages } from '../entities/study-languages/study-language.entity';
import { EntityLearningType, JSONLearning } from '../types/entity-learning.type';
import { Service } from './service.abstract-class';

export abstract class ServiceLearning<
    T extends JSONLearning,
    TT extends EntityLearningType<T>,
    KEY extends keyof T
> extends Service<TT> {
    private diffProperty: KEY;

    constructor(repository: Constructor<TT>, diffProperty: KEY) {
        super(repository);
        this.diffProperty = diffProperty;
    }

    async updateRecord(studyLanguage: StudyLanguages, record: T) {
        const entity = await this.getEntity({ studyLanguage } as any);

        if (!entity) return false;

        entity.json = entity.json.map((item) =>
            similarityDetectorService.detect(item[this.diffProperty], record[this.diffProperty]) ? record : item
        );

        await this.update({ studyLanguage } as any, entity as any);

        return entity;
    }

    async updateFullRecords(studyLanguage: StudyLanguages, records: T[]) {
        const entity = await this.getEntity({ studyLanguage } as any);

        if (!entity) return false;

        entity.json = records;

        return await this.update({ studyLanguage } as any, entity as any);
    }

    async addRecord(studyLanguage: StudyLanguages, records: T[]) {
        const entity = await this.getEntity({ studyLanguage } as any);

        if (!entity) return false;

        records = records.filter(
            (record) =>
                !entity.json.find((record2) =>
                    similarityDetectorService.detect(record2[this.diffProperty] as string, record[this.diffProperty] as string)
                )
        );

        entity.json = [...entity.json, ...records];

        await this.update({ studyLanguage } as any, entity as any);

        return entity;
    }

    async removeRecord(studyLanguage: StudyLanguages, words: string[]) {
        const entity = await this.getEntity({ studyLanguage } as any);
        if (!entity) return false;

        entity.json = entity.json.filter(
            (record) =>
                !words.find((word) =>
                    similarityDetectorService.detect(word, record[this.diffProperty] as string)
                )
        ) as T[];

        await this.update({ studyLanguage } as any, entity as any);

        return entity;
    }

    getJSON(entity: TT) {
        return entity.json as T[];
    }

    getDataDifferenceValue(data: T) {
        return data[this.diffProperty] as string;
    }
}
