import { Flashcard } from '../../../../../services/database/vocabulary/types';
import { random } from '../../../../../shared/utils';
import { GetNextWord } from '../../../../../testing-alghoritm/test-strategy/get-word.abstract-class';

export class TestGetNextFlashcard extends GetNextWord<Flashcard> {

    private priority: {streakUse: number, condition: (streakUse: number) => boolean, get: () => number}[] = [
        {streakUse: 0, condition: (streakUse) => !!this.testing.queueFailed.length && streakUse > 3, get: this.findHighLevelFailedFlashcard},
        {streakUse: 0, condition: (streakUse) => !!this.testing.queueFailed.length && streakUse > 6, get: this.findLowLevelFailedFlashcard},
        {streakUse: 0, condition: (streakUse) => !!this.testing.queue.length && streakUse > 9, get: this.findLowLevelFlashcard},
        {streakUse: 0, condition: (streakUse ) => !!this.testing.queue.length && streakUse > 5, get: this.findHighLevelFlashcard},
        {streakUse: 0, condition: () => true, get: this.findRandomFlashcard}
    ];

    private getRandomFailedQueue(highPriority: boolean) {
        const list = this.testing.queueFailed.filter(info => this.testing.move - info.moveLastTrying > 5 && (highPriority ? this.testing.dataTest[info.index].progress > 5 : this.testing.dataTest[info.index].progress <= 5));

        if(!list.length) {
            return -1;
        }

        return list[random(0, list.length - 1)].index;

    }

    private getRandomQueue(highPriority: boolean) {
        const list = this.testing.queue.filter(index => highPriority ? this.testing.dataTest[index].progress > 5 : this.testing.dataTest[index].progress <= 5);

        if(!list.length) {
            return -1;
        }

        return list[random(0, list.length - 1)];
    }

    private findHighLevelFailedFlashcard() {
        return this.getRandomFailedQueue(true);
    }

    private findLowLevelFailedFlashcard() {
        return this.getRandomFailedQueue(false);
    }

    private findLowLevelFlashcard() {
        return this.getRandomQueue(false);
    }

    private findHighLevelFlashcard() {
        return this.getRandomQueue(true);
    }

    private findRandomFlashcard() {
        const list = [...this.testing.queue, ...this.testing.queueFailed.map(i => i.index)];

        return list[random(0, list.length - 1)];
    }

     getNextWordIndex() {
        if(!this.testing.queue.length && !this.testing.queueFailed.length || this.testing.move === 20) {
            this.testing.startRound();
        }

        if(this.testing.move !== 0 && this.testing.move % 5 === 0) {
            this.testing.sendProgress();
        }

        for(const info of this.priority) {
            if(info.condition(info.streakUse)) {
                const index = info.get.apply(this as any);

                if(index !== -1) {
                    info.streakUse++;

                    return index;
                } else {
                    info.streakUse = 0;
                }
            }
        }

        return -1;
    }
}