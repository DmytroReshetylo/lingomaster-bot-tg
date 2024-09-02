import { TelegramContext } from '../../../../../../core/ctx.class';

export function InputSplitMiddleware(separator: '\n', minCount: number, message: string) {
    return function (ctx: TelegramContext) {
        if(ctx.data.split('\n').length < minCount) {
            return message;
        }

        return null;
    }


}