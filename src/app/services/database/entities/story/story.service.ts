import { FindOptionsWhere } from 'typeorm';
import { ServiceLearning } from '../../abstract-services/service-learning.abstract-class';
import { Vocabulary } from '../vocabulary/vocabulary.entity';
import { Story } from './story.entity';
import { StoryInfo } from './types';

class StoryService extends ServiceLearning<StoryInfo, Story, 'text'>  {
    async getSessionData(conditions: FindOptionsWhere<Vocabulary>) {
        return this.getEntities(conditions);
    }

}

export const storyService = new StoryService();