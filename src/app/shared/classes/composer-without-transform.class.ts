import { injectable } from 'inversify';
import { TelegramContext } from '../../../framework/classes/ctx.class';
import { ComposerWithProtect } from './composer-with-protect.class';

@injectable()
export abstract class ComposerWithoutTransform extends ComposerWithProtect {
    abstract readonly nameState: string;

    async afterInputWithCheck(ctx: TelegramContext) {
        ctx.scene.states[this.nameState] = ctx.data;

        await this.codeAfterGettingData(ctx, ctx.scene.states[this.nameState]);
    }

    abstract codeAfterGettingData(ctx: TelegramContext, dataWithoutTransform: string): void;
}