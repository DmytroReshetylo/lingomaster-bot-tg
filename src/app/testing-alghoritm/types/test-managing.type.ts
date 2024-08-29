import { EntityLearningType } from '../../services/database/types/entity-learning.type';
import { QueueOnDelete } from '../../shared/classes';
import { TestAnswerHandler } from '../test-handling/test-answer-handler.class';
import { TestMessageProvider } from '../test-handling/test-message-provider.class';
import { Testing } from '../test-strategy/testing.class';
import { TransformWord } from '../word-formats/transform-word';

export type TestManaging<T extends {photoUrl: string | null}, TT extends EntityLearningType<T>> = {
    queueOnDelete: QueueOnDelete,
    strategy: Testing<T, TT>,
    testMessageProvider: TestMessageProvider,
    transformWord: TransformWord<T>,
    testAnswerHandler: TestAnswerHandler
}