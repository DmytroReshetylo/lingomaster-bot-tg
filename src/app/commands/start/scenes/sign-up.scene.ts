import { Apply, CreateScene } from '../../../../core';
import { CreateSelectBigButtonComposer, CreateSelectButtonComposer, CreateTextComposer } from '../../../../core/decorators/scene/composers';
import { Scene } from '../../../../core/decorators/scene/types';
import { createBigButtonKeyboard, createButtonKeyboard } from '../../../../core/telegram-utils';
import { Languages } from '../../../../core/language-interface/enums';
import { translate } from '../../../../core/language-interface/translate.alghoritm';
import { Ctx } from '../../../../core/types';
import { userService } from '../../../services/database/user/user.service';
import { AvailableInterfaceLanguages } from '../../../shared/constants';
import { getNavigationButtons, transformLanguageToJsonFormat } from '../../../shared/utils';
import { transformToButtonActions } from '../../../shared/utils';

@CreateScene('sign-up-scene')
export class SignUpScene implements Scene {

    start(ctx: Ctx) {
        ctx.reply('Select interface language', createBigButtonKeyboard(AvailableInterfaceLanguages));

        ctx.wizard.next();
    }

    @CreateSelectBigButtonComposer('interfaceLanguage', transformLanguageToJsonFormat(AvailableInterfaceLanguages), false)
    afterSelectInterfaceLanguage(ctx: Ctx) {
        ctx.wizard.state.interfaceLanguage = translate(ctx.wizard.state.interfaceLanguage, Languages.en);

        ctx.reply(
            translate('SIGN_UP.SELECT_NATIVE_LANGUAGE', ctx.wizard.state.interfaceLanguage),
            createButtonKeyboard(transformToButtonActions(transformLanguageToJsonFormat(Object.values(Languages) as Languages[]), ctx.wizard.state.interfaceLanguage))
        );

        ctx.wizard.next();
    }

    @CreateSelectButtonComposer('nativeLanguage', transformLanguageToJsonFormat(Object.values(Languages) as Languages[]), false)
    afterSelectNativeLanguage(ctx: Ctx) {
        ctx.wizard.state.nativeLanguage = translate(ctx.wizard.state.nativeLanguage, Languages.en);

        ctx.reply(
            translate('SIGN_UP.INPUT_NAME', ctx.wizard.state.interfaceLanguage)
        );

        ctx.wizard.next();
    }

    @CreateTextComposer('name')
    @Apply({middlewares: [], possibleErrors: []})
    async afterInputName(ctx: Ctx) {
        await userService.createAccount(
            ctx.session.idTelegram,
            ctx.wizard.state.name,
            ctx.wizard.state.interfaceLanguage,
            ctx.wizard.state.nativeLanguage,
        )

        ctx.reply(
            translate(
                'SIGN_UP.SUCCESS_REGISTERED',
                ctx.wizard.state.interfaceLanguage
            ),
            getNavigationButtons()
        )

        ctx.scene.leave();
    }
}