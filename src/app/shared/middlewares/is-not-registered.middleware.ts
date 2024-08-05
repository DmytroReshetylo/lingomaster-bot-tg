import { Ctx } from '../../../core/types';

export async function IsNotRegisteredMiddleware(ctx: Ctx) {
   if(ctx.session.user) {
       return 'MIDDLEWARES.USER_ALREADY_REGISTERED';
   }

   return null;
}