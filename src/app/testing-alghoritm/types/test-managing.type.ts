import { QueueOnDelete } from '../../shared/classes';
import { TestAnswerHandler } from '../test-handling/test-answer-handler.class';
import { TestMessageProvider } from '../test-handling/test-message-provider.class';
import { Testing } from '../test-strategy/testing.class';
import { TransformWord } from '../word-formats/transform-word';
import { ServiceJson } from '../../services/database/service-json.type';

export type TestManaging<T extends Record<string, any>, TT extends ServiceJson> = {
    queueOnDelete: QueueOnDelete,
    strategy: Testing<T, TT>,
    testMessageProvider: TestMessageProvider,
    transformWord: TransformWord<T>,
    testAnswerHandler: TestAnswerHandler
}