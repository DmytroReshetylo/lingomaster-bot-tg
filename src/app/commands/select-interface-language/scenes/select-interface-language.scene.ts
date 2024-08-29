import { Apply, CreateScene } from '../../../../core';
import { TelegramContext } from '../../../../core/ctx.class';
import { ModifyParams } from '../../../../core/decorators/modify-params/modify-params.decorator';
import { CreateSelectBigButtonComposer } from '../../../../core/decorators/scene/composers';
import { Scene } from '../../../../core/decorators/scene/types';
import { InterfaceLanguages } from '../../../../core/language-interface/enums';
import { Service } from '../../../services/database/abstract-services/service.abstract-class';
import { User } from '../../../services/database/entities/user/user.entity';
import { userService } from '../../../services/database/entities/user/user.service';
import { CreateFinishReplyAction, CreateReplyAction } from '../../../shared/actions';
import { AvailableInterfaceLanguagesJsonFormat } from '../../../shared/constants';
import { TransformLanguage } from '../../../shared/modify-params';
import { ApplyServicePartAction } from '../../../shared/part-actions';
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
        await ApplyServicePartAction<User, Service<User>>(ctx, userService, 'update', {idTelegram: String(ctx.message.from.id)}, {interfaceLanguage});

        CreateFinishReplyAction(ctx, 'SELECT_INTERFACE_LANGUAGE.FINISHED', interfaceLanguage);
    }
}