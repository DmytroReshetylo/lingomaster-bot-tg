import { FindOptionsWhere } from 'typeorm';
import { StudyLanguageServicesSubscribers } from '../../../../shared/session/study-language-services-subscribers';
import { PhotoManagerSubscribers } from '../../../photo-manager/photo-manager.subscribers';
import { ServiceLearning } from '../../abstract-services/service-learning.abstract-class';
import { EntityNames } from '../entity-names';
import { Flashcard } from './types';
import { Vocabulary } from './vocabulary.entity';

export class VocabularyService extends ServiceLearning<Flashcard, Vocabulary, 'word'> {
    constructor() {
        super(Vocabulary,  'word');

        StudyLanguageServicesSubscribers.set(this, EntityNames.Vocabulary);
        PhotoManagerSubscribers.push(this);
    }

    async getSessionData(conditions: FindOptionsWhere<Vocabulary>) {
        return this.getEntity(conditions);
    }
}

export const vocabularyService = new VocabularyService();