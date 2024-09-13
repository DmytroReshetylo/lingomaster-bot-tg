import { TelegramContext } from '../../../framework/classes/ctx.class';
import { ProtectConfig } from '../../../framework/types/protect-config.type';
import { GetFirstReturn } from './get-first-return.util';

export async function ApplyCodeWithProtect(ctx: any, code: (ctx: TelegramContext) => void, { middlewares, errors }: ProtectConfig) {
    const tgCtx = new TelegramContext(ctx);

    try {
        const result = await GetFirstReturn(ctx, middlewares);

        if(result) {
            await tgCtx.reply(result);

            tgCtx.scene.backComposer();

            return;
        }

        await code(tgCtx);
    }
    catch (err: any) {
        const result = await GetFirstReturn(err, errors);

        if(result) {
            await tgCtx.reply(result);
        }
        else {
            await tgCtx.reply(defaultBotMethods.errorMessage());

            tgCtx.scene.leaveScene();
        }
    }
}