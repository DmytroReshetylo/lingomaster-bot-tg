
import { SessionSubscribers } from '../../../shared/session/update-session-subscribers';
import { PhotoManagerSubscribers } from '../../photo-manager/photo-manager.subscribers';
import { ServiceLearning } from '../service-learning.abstract-class';
import { Flashcard } from './types';
import { Vocabulary } from './vocabulary.entity';

export class VocabularyService extends ServiceLearning<Vocabulary, Flashcard, 'flashcards', 'word'> {
    constructor() {
        super(Vocabulary, 'flashcards', 'word');

        SessionSubscribers.set(this, 'vocabularies');
        PhotoManagerSubscribers.push(this);
    }
}

export const vocabularyService = new VocabularyService();