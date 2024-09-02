import { TelegramContext } from '../../../core/ctx.class';

export function IsNotPhohibitedSymbolsMiddleware(prohibitedSymbols: string[], message: string) {

    return function (ctx: TelegramContext) {
        const result = prohibitedSymbols.find(symbol => ctx.data.includes(symbol));

        if(result) {
            return message;
        }

        return null;
    }

}