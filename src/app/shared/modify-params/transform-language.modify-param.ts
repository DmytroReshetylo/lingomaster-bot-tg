import { TelegramContext } from '../../../core/ctx.class';
import { Languages } from '../../../core/language-interface/enums';
import { translate } from '../../../core/language-interface/translate.alghoritm';
import { createModifyParam } from '../../../core/telegram-utils';

export const TransformLanguage = createModifyParam((ctx: TelegramContext, state: string) => {
    ctx.scene.states[state] = translate(ctx.scene.states[state], Languages.en);

    return ctx.scene.states[state];
});