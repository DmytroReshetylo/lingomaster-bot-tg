import { inject, injectable } from 'inversify';
import { TelegramContext } from '../../../framework/classes/ctx.class';
import { TriggerStructure } from '../../../framework/types/trigger-structure.type';
import { Protect } from '../../core/types/protect.type';
import { ApplyProtect } from '../../core/utils/apply-protect.util';
import { TranslateProvider } from '../providers/translate.provider';

@injectable()
export abstract class TriggerWithProtect implements TriggerStructure {

    constructor(@inject(TranslateProvider) protected readonly translator: TranslateProvider) {}

    async code(ctx: TelegramContext) {
        await ApplyProtect(ctx, this.translator, this.protect(), this.codeAfterCheck.bind(this));
    }

    abstract codeAfterCheck(ctx: TelegramContext): void;

    abstract protect(): Protect;

}