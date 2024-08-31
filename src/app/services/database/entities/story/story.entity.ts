import { Entity } from 'typeorm';
import { CreateEntityLearning } from '../../utils/create-entity-learning.utils';
import { EntityNames } from '../entity-names';
import { StoryInfo } from './types';

@Entity(EntityNames.Story)
export class Story extends CreateEntityLearning<StoryInfo>(EntityNames.Story) {

}