import { TelegramContext } from '../../../core/ctx.class';

export class QueueOnDelete {
    #ctx: TelegramContext;
    #queue: number[] = [];

    constructor(ctx: TelegramContext) {
        this.#ctx = ctx;
    }

    push(id_message: number) {
        this.#queue.push(id_message);
    }

    deleteAllMessagesInQueue(timeout = 0) {
        const queue = [...this.#queue];

        setTimeout(() => {
            queue.forEach((id) => this.#ctx.deleteMessage(id));
        }, timeout);

        this.#queue = [];
    }
}