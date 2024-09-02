import { FindOptionsWhere } from 'typeorm';
import { SessionSubscribers } from '../../../../shared/session/update-session-subscribers';
import { Service } from '../../abstract-services/service.abstract-class';
import { EntityNames } from '../entity-names';
import { StudyLanguages } from './study-language.entity';

export class StudyLanguageService extends Service<StudyLanguages> {
    constructor() {
        super(StudyLanguages);

        SessionSubscribers.set(this, EntityNames.StudyLanguages);
    }

    async getSessionData(conditions: FindOptionsWhere<StudyLanguages>) {
        return this.getEntities(conditions);
    }
}

export const studyLanguageService = new StudyLanguageService();