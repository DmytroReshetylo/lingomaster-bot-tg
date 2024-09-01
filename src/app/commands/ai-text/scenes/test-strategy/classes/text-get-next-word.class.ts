import { TextInfo } from '../../../../../services/database/entities/ai-text/types';
import { GetNextWord } from '../../../../../testing-alghoritm/test-strategy/get-word.abstract-class';

export class TestTextGetNextWord extends GetNextWord<TextInfo> {
     getNextWordIndex() {
        if(!this.testing.queue.length) {
            return -1;
        }

        if(this.testing.move !== 0 && this.testing.move % 5 === 0) {
            this.testing.sendProgress();
        }

        return this.testing.move;
    }
}