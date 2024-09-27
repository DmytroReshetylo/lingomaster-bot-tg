import { injectable } from 'inversify';
import { TelegramContext } from '../../../framework/classes/ctx.class';
import { CreateMessageCancelled } from '../../core/utils/create-message-cancelled,util';
import { ComposerWithoutTransform } from './composer-without-transform.class';

@injectable()
export abstract class SelectButtonComposerWithoutTransform extends ComposerWithoutTransform {
    abstract readonly listAvailableActions: any[];
    abstract readonly cancelButton: boolean;

    async codeAfterGettingData(ctx: TelegramContext) {
        if(this.cancelButton && ctx.scene.states[this.nameState] === 'BUTTONS.CANCEL') {
            return CreateMessageCancelled(ctx, this.translator);
        }

        if(this.listAvailableActions.includes(ctx.scene.states[this.nameState])) {
            await this.codeIfAvailableAction(ctx, ctx.scene.states[this.nameState]);
        }
    }

    abstract codeIfAvailableAction(ctx: TelegramContext, dataWithoutTransform: string): void;
}