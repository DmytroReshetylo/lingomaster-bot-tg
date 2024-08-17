import { TelegramContext } from '../../../core/ctx.class';

export async function IsNotRegisteredMiddleware(ctx: TelegramContext) {
   if(ctx.session['user']) {
       return 'MIDDLEWARES.USER_ALREADY_REGISTERED';
   }

   return null;
}