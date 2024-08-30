import { JSONLearning } from '../../services/database/types/entity-learning.type';
import { QueueOnDelete } from '../../shared/classes';
import { TestAnswerHandler } from '../test-handling/test-answer-handler.class';
import { TestMessageProvider } from '../test-handling/test-message-provider.class';
import { Testing } from '../test-strategy/testing.class';
import { TransformWord } from '../word-formats/transform-word';

export type TestManaging<T extends JSONLearning> = {
    queueOnDelete: QueueOnDelete,
    strategy: Testing<T>,
    testMessageProvider: TestMessageProvider,
    transformWord: TransformWord<T>,
    testAnswerHandler: TestAnswerHandler
}