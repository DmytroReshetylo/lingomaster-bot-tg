import { ObjectLiteral } from 'typeorm';
import { Testing } from './testing.class';


export abstract class ChangeProgress<T extends ObjectLiteral & { photoUrl: string | null }> {
    protected testing!: Testing<T>;

    setTesting(testing: Testing<T>) {
        this.testing = testing;
    }

    abstract changeProgress(index: number, success: boolean): void;
}