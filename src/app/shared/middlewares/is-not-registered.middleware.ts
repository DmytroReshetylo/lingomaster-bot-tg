import { TelegramContext } from '../../../core/ctx.class';
import { EntityNames } from '../../services/database/entities/entity-names';

export async function IsNotRegisteredMiddleware(ctx: TelegramContext) {
   if(ctx.session[EntityNames.User]) {
       return 'MIDDLEWARES.USER_ALREADY_REGISTERED';
   }

   return null;
}