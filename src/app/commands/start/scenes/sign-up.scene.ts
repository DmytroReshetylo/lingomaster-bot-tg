import { Apply, CreateScene } from '../../../../core';
import { TelegramContext } from '../../../../core/ctx.class';
import { CreateSelectBigButtonComposer, CreateSelectButtonComposer, CreateTextComposer } from '../../../../core/decorators/scene/composers';
import { Scene } from '../../../../core/decorators/scene/types';
import { createBigButtonKeyboard, createButtonKeyboard } from '../../../../core/telegram-utils';
import { Languages } from '../../../../core/language-interface/enums';
import { translate } from '../../../../core/language-interface/translate.alghoritm';
import { userService } from '../../../services/database/user/user.service';
import { AvailableInterfaceLanguages } from '../../../shared/constants';
import { getNavigationButtons, transformLanguageToJsonFormat } from '../../../shared/utils';
import { transformToButtonActions } from '../../../shared/utils';

@CreateScene('sign-up-scene')
export class SignUpScene implements Scene {

    start(ctx: TelegramContext) {
        ctx.reply('Select interface language', createBigButtonKeyboard(AvailableInterfaceLanguages));

        ctx.scene.nextAction();
    }

    @CreateSelectBigButtonComposer('interfaceLanguage', transformLanguageToJsonFormat(AvailableInterfaceLanguages), false)
    afterSelectInterfaceLanguage(ctx: TelegramContext) {
        ctx.scene.states.interfaceLanguage = translate(ctx.scene.states.interfaceLanguage, Languages.en);

        ctx.reply(
            translate('SIGN_UP.SELECT_NATIVE_LANGUAGE', ctx.scene.states.interfaceLanguage),
            createButtonKeyboard(transformToButtonActions(transformLanguageToJsonFormat(Object.values(Languages) as Languages[]), ctx.scene.states.interfaceLanguage))
        );

        ctx.scene.nextAction();
    }

    @CreateSelectButtonComposer('nativeLanguage', transformLanguageToJsonFormat(Object.values(Languages) as Languages[]), false)
    afterSelectNativeLanguage(ctx: TelegramContext) {
        ctx.scene.states.nativeLanguage = translate(ctx.scene.states.nativeLanguage, Languages.en);

        ctx.reply(
            translate('SIGN_UP.INPUT_NAME', ctx.scene.states.interfaceLanguage)
        );

        ctx.scene.nextAction();
    }

    @CreateTextComposer('name')
    @Apply({middlewares: [], possibleErrors: []})
    async afterInputName(ctx: TelegramContext) {
        await userService.createAccount(
            ctx.session['idTelegram'],
            ctx.scene.states.name,
            ctx.scene.states.interfaceLanguage,
            ctx.scene.states.nativeLanguage,
        )

        ctx.reply(
            translate(
                'SIGN_UP.SUCCESS_REGISTERED',
                ctx.scene.states.interfaceLanguage
            ),
            getNavigationButtons()
        )

        ctx.scene.leaveScene();
    }
}