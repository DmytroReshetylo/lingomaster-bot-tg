import { ObjectLiteral } from 'typeorm';
import { Testing } from './testing.class';

export abstract class GetNextWord<T extends ObjectLiteral & { photoUrl: string | null }> {
    protected testing!: Testing<T>;

    setTesting(testing: Testing<T>) {
        this.testing = testing;
    }

    abstract getNextWordIndex(): number;
}
