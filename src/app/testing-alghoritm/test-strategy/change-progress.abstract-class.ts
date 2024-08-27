import { Testing } from './testing.class';


export abstract class ChangeProgress<T> {
    protected testing!: Testing<T, any>;

    setTesting(testing: Testing<T, any>) {
        this.testing = testing;
    }

    abstract changeProgress(index: number, success: boolean): void;
}