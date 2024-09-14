import { TelegramContext } from '../../../../framework/classes/ctx.class';
import { CreateInputTextComposer } from '../../../../framework/decorators/create-text-composer';
import { Protect } from '../../../core/types/protect.type';
import { EndComposer } from '../../../shared/classes/end-composer.class';

@CreateInputTextComposer()
export class SignUpComposer extends EndComposer {
    endComposer(ctx: TelegramContext) {
        console.log(ctx.scene.states);
        ctx.reply('TEST');
    }

    protect(): Protect {
        return {
            middlewares: [],
            errors: []
        };
    }

}