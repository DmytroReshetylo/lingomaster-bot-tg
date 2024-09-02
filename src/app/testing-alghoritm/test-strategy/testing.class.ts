import { ServiceLearning } from '../../services/database/abstract-services/service-learning.abstract-class';
import { EntityLearningType, JSONLearning } from '../../services/database/types/entity-learning.type';
import { ChangeProgress } from './change-progress.abstract-class';
import { GetNextWord } from './get-word.abstract-class';
import { FailedQueueInfo } from './types';

export class Testing<T extends JSONLearning> {
    private idEntity: number;
    readonly dataTest: T[];
    protected service: ServiceLearning<T, EntityLearningType<T>, any>;

    private changeProgressExemplar: ChangeProgress<T>;
    private getWordExemplar: GetNextWord<T>;

    move: number = 0;

    queue: number[] = [];
    queueFailed: FailedQueueInfo[] = [];

    constructor(
        entity: EntityLearningType<T>,
        service: ServiceLearning<T, EntityLearningType<T>, any>,
        changeProgressClass: ChangeProgress<T>,
        getWordClass: GetNextWord<T>
    ) {
        this.dataTest = entity.json;
        this.idEntity = entity.id;
        this.service = service;
        this.changeProgressExemplar = changeProgressClass;
        this.getWordExemplar = getWordClass;

        this.changeProgressExemplar.setTesting(this);
        this.getWordExemplar.setTesting(this);

        this.startRound();
    }

    startRound() {
        this.queue = this.dataTest.map((v, index) => index);
        this.move = 0;
    }

    async sendProgress() {
        await this.service.updateFullRecords({id: this.idEntity} as any, this.dataTest);
    }

    getNextWordIndex() {
        return this.getWordExemplar.getNextWordIndex();
    }

    changeProgress(index: number, success: boolean) {
        this.changeProgressExemplar.changeProgress(index, success);
    }
}