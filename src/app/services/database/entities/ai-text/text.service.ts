import { FindOptionsWhere } from 'typeorm';
import { StudyLanguageServicesSubscribers } from '../../../../shared/session/study-language-services-subscribers';
import { PhotoManagerSubscribers } from '../../../photo-manager/photo-manager.subscribers';
import { ServiceLearning } from '../../abstract-services/service-learning.abstract-class';
import { EntityNames } from '../entity-names';
import { AIText } from './text.entity';
import { TextInfo } from './types';

class TextService extends ServiceLearning<TextInfo, AIText,  'word'>  {

    constructor() {
        super(AIText,  'word');

        StudyLanguageServicesSubscribers.set(this, EntityNames.Text);
        PhotoManagerSubscribers.push(this);
    }

    async getSessionData(conditions: FindOptionsWhere<AIText>) {
        return this.getEntities(conditions);
    }

}

export const textService = new TextService();