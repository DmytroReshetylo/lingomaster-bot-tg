import { Testing } from './testing.class';

export abstract class GetNextWord<T> {
    protected testing!: Testing<T, any>;

    setTesting(testing: Testing<T, any>) {
        this.testing = testing;
    }

    abstract getNextWordIndex(): number;
}