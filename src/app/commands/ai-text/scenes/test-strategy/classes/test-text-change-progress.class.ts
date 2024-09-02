import { TextInfo } from '../../../../../services/database/entities/ai-text/types';
import { ChangeProgress } from '../../../../../testing-alghoritm/test-strategy/change-progress.abstract-class';

export class TestTextChangeProgress extends ChangeProgress<TextInfo> {

    changeProgress(index: number, success: boolean) {
        this.testing.queue = this.testing.queue.filter(i => i !== index);

        this.testing.move++;
    }
}