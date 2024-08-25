import { FindOptionsWhere, ObjectLiteral } from 'typeorm';
import { Languages } from '../../../core/language-interface/enums';
import { Constructor } from '../../../core/types';
import { Service } from '../../services/database';
import { User } from '../../services/database/user/user.entity';
import { ChangeProgress } from './change-progress.abstract-class';
import { GetNextWord } from './get-word.abstract-class';
import { FailedQueueInfo } from './types';

export class Testing<T, TT extends { user: User; language: Languages } & ObjectLiteral> {
    protected user: User;
    readonly dataTest: T[];
    protected service: Service<TT>;
    protected language: Languages;
    protected paramDataTest: string;

    private changeProgressExemplar: ChangeProgress<T>;
    private getWordExemplar: GetNextWord<T>;

    move: number = 0;

    queue: number[] = [];
    queueFailed: FailedQueueInfo[] = [];

    constructor(
        user: User,
        language: Languages,
        dataTest: T[],
        service: Service<TT>,
        paramDataTest: string,
        changeProgressClass: ChangeProgress<T>,
        getWordClass: GetNextWord<T>
    ) {
        this.user = user;
        this.dataTest = dataTest;
        this.service = service;
        this.language = language;
        this.paramDataTest = paramDataTest;
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
        const changeOptions: any = {};
        changeOptions[this.paramDataTest] = this.dataTest;

        await this.service.update({user: this.user, language: this.language} as FindOptionsWhere<TT>, changeOptions);
    }

    getNextWordIndex() {
        return this.getWordExemplar.getNextWordIndex();
    }

    changeProgress(index: number, success: boolean) {
        this.changeProgressExemplar.changeProgress(index, success);
    }
}