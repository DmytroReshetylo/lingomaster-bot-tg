import { Apply, CreateScene } from '../../../../core';
import { CreateSelectBigButtonComposer } from '../../../../core/decorators/scene/composers';
import { Scene } from '../../../../core/decorators/scene/types';
import { translate, translateArray } from '../../../../core/language-interface/translate.alghoritm';
import { createBigButtonKeyboard } from '../../../../core/telegram-utils';
import { Ctx } from '../../../../core/types';
import { userService } from '../../../services/database/user/user.service';
import { AvailableInterfaceLanguages } from '../../../shared/constants';
import { getNavigationButtons, transformLanguageToJsonFormat } from '../../../shared/utils';
import { IsNotAlreadySelectedInterfaceLanguageMiddleware } from './middlewares';

@CreateScene('select-interface-language-scene')
export class SelectInterfaceLanguageScene implements Scene {

    start(ctx: Ctx) {
        ctx.reply(
            translate('SELECT_INTERFACE_LANGUAGE.ASK', ctx.session.user.interfaceLanguage),
            createBigButtonKeyboard(
                translateArray(
                    [...transformLanguageToJsonFormat(AvailableInterfaceLanguages), 'BUTTONS.CANCEL'],
                    ctx.session.user.interfaceLanguage
                )
            )
        );

        ctx.wizard.next();
    }

    @CreateSelectBigButtonComposer('interfaceLanguage', transformLanguageToJsonFormat(AvailableInterfaceLanguages), true)
    @Apply({middlewares: [IsNotAlreadySelectedInterfaceLanguageMiddleware], possibleErrors: []})
    async afterSelectInterfaceLanguage(ctx: Ctx) {
        await userService.changeLanguageInterface(ctx.session.idTelegram, ctx.wizard.state.interfaceLanguage);

        ctx.session.user.interfaceLanguage = ctx.wizard.state.interfaceLanguage;

        ctx.reply(translate('SELECT_INTERFACE_LANGUAGE.FINISHED', ctx.session.user.interfaceLanguage), getNavigationButtons());

        ctx.scene.leave();
    }
}