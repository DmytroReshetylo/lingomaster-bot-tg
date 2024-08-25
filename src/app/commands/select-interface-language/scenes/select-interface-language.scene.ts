import { Apply, CreateScene } from '../../../../core';
import { TelegramContext } from '../../../../core/ctx.class';
import { ModifyParams } from '../../../../core/decorators/modify-params/modify-params.decorator';
import { CreateSelectBigButtonComposer } from '../../../../core/decorators/scene/composers';
import { Scene } from '../../../../core/decorators/scene/types';
import { InterfaceLanguages } from '../../../../core/language-interface/enums';
import { translate, translateArray } from '../../../../core/language-interface/translate.alghoritm';
import { createBigButtonKeyboard } from '../../../../core/telegram-utils';
import { userService } from '../../../services/database/user/user.service';
import { AvailableInterfaceLanguagesJsonFormat } from '../../../shared/constants';
import { TransformLanguage } from '../../../shared/modify-params';
import { getNavigationButtons } from '../../../shared/utils';
import { IsNotAlreadySelectedInterfaceLanguageMiddleware } from './middlewares';

@CreateScene('select-interface-language-scene')
export class SelectInterfaceLanguageScene implements Scene {

    start(ctx: TelegramContext) {
        ctx.reply(
            translate('SELECT_INTERFACE_LANGUAGE.ASK', ctx.session['user'].interfaceLanguage),
            createBigButtonKeyboard(
                translateArray(
                    [...AvailableInterfaceLanguagesJsonFormat, 'BUTTONS.CANCEL'],
                    ctx.session['user'].interfaceLanguage
                )
            )
        );

        ctx.scene.nextAction();
    }

    @CreateSelectBigButtonComposer('interfaceLanguage', AvailableInterfaceLanguagesJsonFormat, true)
    @Apply({middlewares: [IsNotAlreadySelectedInterfaceLanguageMiddleware], possibleErrors: []})
    @ModifyParams()
    async afterSelectInterfaceLanguage(ctx: TelegramContext, @TransformLanguage('interfaceLanguage') interfaceLanguage: InterfaceLanguages) {
        await userService.update({idTelegram: ctx.session['idTelegram']}, {interfaceLanguage});

        ctx.session['user'].interfaceLanguage = interfaceLanguage;

        ctx.reply(translate('SELECT_INTERFACE_LANGUAGE.FINISHED', interfaceLanguage), getNavigationButtons());

        ctx.scene.leaveScene();
    }
}