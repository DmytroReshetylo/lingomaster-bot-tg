import { inject, injectable } from 'inversify';
import { TelegramContext } from '../../../framework/classes/ctx.class';
import { ComposerStructure } from '../../../framework/types/composer-structure.type';
import { TranslateProvider } from '../../core/providers/translate.provider';
import { Protect } from '../../core/types/protect.type';
import { ApplyProtect } from '../../core/utils/apply-protect.util';

@injectable()
export abstract class ComposerWithProtect implements ComposerStructure {
    constructor(@inject(TranslateProvider) protected readonly translator: TranslateProvider) {}

    async afterAnswer(ctx: TelegramContext) {
        await ApplyProtect(ctx, this.translator, this.protect(), this.afterAnswerWithCheck.bind(this));
    }

    abstract afterAnswerWithCheck(ctx: TelegramContext): void;

    abstract beforeAnswer(ctx: TelegramContext): void;

    abstract protect(): Protect;
}