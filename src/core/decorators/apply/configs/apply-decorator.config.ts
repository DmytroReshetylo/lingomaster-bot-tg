import { TransformApplyDecoratorMessage, UnknownCommandMessage } from './types';

class ApplyDecoratorConfiguration {
    #transformApplyDecoratorMessage: TransformApplyDecoratorMessage = (message: string) => message;
    #unknownCommandMessage: UnknownCommandMessage = () => 'Unknown command';

    setConfiguration(transformApplyDecoratorMessage: TransformApplyDecoratorMessage, unknownCommandMessage: UnknownCommandMessage) {
        this.#transformApplyDecoratorMessage = transformApplyDecoratorMessage;
        this.#unknownCommandMessage = unknownCommandMessage;
    }

    get transformApplyDecoratorMessage() {
        return this.#transformApplyDecoratorMessage;
    }

    get unknownCommandMessage() {
        return this.#unknownCommandMessage;
    }
}

export const applyDecoratorConfig = new ApplyDecoratorConfiguration();