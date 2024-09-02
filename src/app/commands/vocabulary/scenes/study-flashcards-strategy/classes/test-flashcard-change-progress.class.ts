import { Flashcard } from '../../../../../services/database/entities/vocabulary/types';
import { ChangeProgress } from '../../../../../testing-alghoritm/test-strategy/change-progress.abstract-class';
import { ProgressFailedChanges } from '../constants';

export class TestFlashcardChangeProgress extends ChangeProgress<Flashcard> {

    changeProgress(index: number, success: boolean) {
        const flashcard = this.testing.dataTest[index];

        this.testing.queue = this.testing.queue.filter(i => i !== index);

        if(success) {
            flashcard.progress = flashcard.progress === 10 ? flashcard.progress : flashcard.progress + 1;

            this.testing.queueFailed = this.testing.queueFailed.filter(info => info.index !== index);
        } else {
            flashcard.progress = flashcard.progress === 0 ? flashcard.progress : ProgressFailedChanges[flashcard.progress];

            const indexInFailedFlashcards = this.testing.queueFailed.findIndex( info => info.index === index);

            if(indexInFailedFlashcards === -1) {
                this.testing.queueFailed.push({index,  moveLastTrying: this.testing.move});
            } else {
                this.testing.queueFailed[indexInFailedFlashcards].moveLastTrying = this.testing.move;
            }
        }

        this.testing.move++;
    }
}