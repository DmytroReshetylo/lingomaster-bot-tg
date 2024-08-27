import { Apply, CreateScene } from '../../../../core';
import { TelegramContext } from '../../../../core/ctx.class';
import { ModifyParams } from '../../../../core/decorators/modify-params/modify-params.decorator';
import { CreateSelectBigButtonComposer } from '../../../../core/decorators/scene/composers';
import { Scene } from '../../../../core/decorators/scene/types';
import { InterfaceLanguages } from '../../../../core/language-interface/enums';
import { userService } from '../../../services/database/user/user.service';
import { CreateFinishReplyAction, CreateReplyAction } from '../../../shared/actions';
import { AvailableInterfaceLanguagesJsonFormat } from '../../../shared/constants';
import { TransformLanguage } from '../../../shared/modify-params';
import { IsNotAlreadySelectedInterfaceLanguageMiddleware } from './middlewares';

@CreateScene('select-interface-language-scene')
export class SelectInterfaceLanguageScene implements Scene {

    start(ctx: TelegramContext) {
        CreateReplyAction(
            ctx,
            'SELECT_INTERFACE_LANGUAGE.ASK',
            ctx.session['user'].interfaceLanguage,
            'bigButton',
            [...AvailableInterfaceLanguagesJsonFormat, 'BUTTONS.CANCEL']
        );
    }

    @CreateSelectBigButtonComposer('interfaceLanguage', AvailableInterfaceLanguagesJsonFormat, true)
    @Apply({middlewares: [IsNotAlreadySelectedInterfaceLanguageMiddleware], possibleErrors: []})
    @ModifyParams()
    async afterSelectInterfaceLanguage(ctx: TelegramContext, @TransformLanguage('interfaceLanguage') interfaceLanguage: InterfaceLanguages) {
        await userService.update({idTelegram: ctx.session['idTelegram']}, {interfaceLanguage});

        ctx.session['user'].interfaceLanguage = interfaceLanguage;

        CreateFinishReplyAction(ctx, 'SELECT_INTERFACE_LANGUAGE.FINISHED', interfaceLanguage);
    }
}