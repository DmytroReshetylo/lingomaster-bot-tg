import { Service } from '../service.abstract-classes';
import { Vocabulary } from './vocabulary.entity';

export class VocabularyService extends Service<Vocabulary> {
    constructor() {
        super(Vocabulary);
    }
}

export const vocabularyService = new VocabularyService();