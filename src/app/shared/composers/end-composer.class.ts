import { inject, injectable } from 'inversify';
import { TelegramContext } from '../../../framework/classes/ctx.class';
import { ComposerStructure } from '../../../framework/types/composer-structure.type';
import { TranslateProvider } from '../../core/providers/translate.provider';
import { Protect } from '../../core/types/protect.type';
import { ApplyProtect } from '../../core/utils/apply-protect.util';

@injectable()
export abstract class EndComposer implements ComposerStructure {
    constructor(@inject(TranslateProvider) protected readonly translator: TranslateProvider) {}

    abstract endComposer(ctx: TelegramContext): void;

    async beforeAnswer(ctx: TelegramContext) {
        await ApplyProtect(ctx, this.translator, this.protect(), this.endComposer.bind(this));

        return ctx.scene.leaveScene();
    }

    afterAnswer(ctx: TelegramContext) {}

    abstract protect(): Protect;
}