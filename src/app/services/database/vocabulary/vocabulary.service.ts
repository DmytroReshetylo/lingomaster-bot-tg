import { FindOptionsWhere } from 'typeorm';
import { SessionSubscribers } from '../../../shared/session/update-session-subscribers';
import { PhotoManagerSubscribers } from '../../photo-manager/photo-manager.subscribers';
import { ServiceLearning } from '../service-learning.abstract-class';
import { Vocabulary } from './vocabulary.entity';

export class VocabularyService extends ServiceLearning<Vocabulary, 'flashcards', 'word'> {
    constructor() {
        super(Vocabulary, 'flashcards', 'word');

        SessionSubscribers.set(this, 'vocabularies');
        PhotoManagerSubscribers.push(this);
    }

    async getSessionData(conditions: FindOptionsWhere<Vocabulary>) {
        return this.getEntities(conditions);
    }
}

export const vocabularyService = new VocabularyService();