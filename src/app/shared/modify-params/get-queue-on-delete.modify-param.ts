import { createModifyParam } from '../../../core/telegram-utils';
import { QueueOnDelete } from '../classes';

export const GetQueueOnDelete = createModifyParam(ctx => {
    if(!ctx.scene.states.getQueueOnDelete) {
        ctx.scene.states.getQueueOnDelete = new QueueOnDelete(ctx);
    }

    return ctx.scene.states.getQueueOnDelete;
});