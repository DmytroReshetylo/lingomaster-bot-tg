import { inject, injectable } from 'inversify';
import { TelegramContext } from '../../../framework/classes/ctx.class';
import { ComposerStructure } from '../../../framework/types/composer-structure.type';
import { Protect } from '../../core/types/protect.type';
import { ApplyProtect } from '../../core/utils/apply-protect.util';
import { TranslateProvider } from '../providers/translate.provider';

@injectable()
export abstract class ComposerWithProtect implements ComposerStructure {
    constructor(@inject(TranslateProvider) protected readonly translator: TranslateProvider) {}

    async afterInput(ctx: TelegramContext) {
        await ApplyProtect(ctx, this.translator, this.protect(), this.afterInputWithCheck.bind(this));
    }

    abstract afterInputWithCheck(ctx: TelegramContext): void;

    abstract beforeInput(ctx: TelegramContext): void;

    abstract protect(): Protect;
}