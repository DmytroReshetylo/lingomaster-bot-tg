import { injectable } from 'inversify';
import { TelegramContext } from '../../../framework/classes/ctx.class';
import { CreateMessageCancelled } from '../../core/utils/create-message-cancelled,util';
import { ComposerWithTransform } from './composer-with-transform.class';

@injectable()
export abstract class SelectButtonComposerWithTransform extends ComposerWithTransform {
    abstract readonly listAvailableActions: any[];
    abstract readonly cancelButton: boolean;

    async codeAfterTransform(ctx: TelegramContext) {
        if(this.cancelButton && ctx.scene.states[this.nameState] === 'BUTTONS.CANCEL') {
            return CreateMessageCancelled(ctx, this.translator);
        }

        if(this.listAvailableActions.includes(ctx.scene.states[this.nameState])) {
            this.codeIfAvailableAction(ctx, ctx.scene.states[this.nameState]);
        }
    }

    abstract codeIfAvailableAction(ctx: TelegramContext, dataAfterTransform: string): void;
}