import { QueueOnDelete } from '../../shared/classes';
import { TestAnswerHandler } from '../test-handling/test-answer-handler.class';
import { TestMessageProvider } from '../test-handling/test-message-provider.class';
import { Testing } from '../test-strategy/testing.class';
import { TransformWord } from '../word-formats/transform-word';
import { ServiceWithJson } from '../../services/database/service-with-json.type';

export type TestManaging<T extends Record<string, any>, TT extends ServiceWithJson> = {
    queueOnDelete: QueueOnDelete,
    strategy: Testing<T, TT>,
    testMessageProvider: TestMessageProvider,
    transformWord: TransformWord<T>,
    testAnswerHandler: TestAnswerHandler
}