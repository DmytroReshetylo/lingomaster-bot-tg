import { JSONLearning } from '../../services/database/types/entity-learning.type';
import { Testing } from './testing.class';

export abstract class ChangeProgress<T extends JSONLearning> {
    protected testing!: Testing<T>;

    setTesting(testing: Testing<T>) {
        this.testing = testing;
    }

    abstract changeProgress(index: number, success: boolean): void;
}