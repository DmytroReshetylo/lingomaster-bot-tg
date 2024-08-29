import { Apply, CreateScene } from '../../../../core';
import { TelegramContext } from '../../../../core/ctx.class';
import { ModifyParams } from '../../../../core/decorators/modify-params/modify-params.decorator';
import { CreateSelectBigButtonComposer, CreateSelectButtonComposer, CreateTextComposer } from '../../../../core/decorators/scene/composers';
import { Scene } from '../../../../core/decorators/scene/types';
import { createBigButtonKeyboard } from '../../../../core/telegram-utils';
import { InterfaceLanguages, Languages } from '../../../../core/language-interface/enums';
import { userService } from '../../../services/database/entities/user/user.service';
import { CreateFinishReplyAction, CreateReplyAction } from '../../../shared/actions';
import { AvailableInterfaceLanguages, LanguageJsonFormat } from '../../../shared/constants';
import { AvailableInterfaceLanguagesJsonFormat } from '../../../shared/constants';
import { TransformLanguage } from '../../../shared/modify-params';
import { ApplyServicePartAction } from '../../../shared/part-actions/apply-service.part-action';

@CreateScene('sign-up-scene')
export class SignUpScene implements Scene {

    start(ctx: TelegramContext) {
        ctx.reply('Select interface language', createBigButtonKeyboard(AvailableInterfaceLanguages));

        ctx.scene.nextAction();
    }

    @CreateSelectBigButtonComposer('interfaceLanguage', AvailableInterfaceLanguagesJsonFormat, false)
    @ModifyParams()
    afterSelectInterfaceLanguage(ctx: TelegramContext, @TransformLanguage('interfaceLanguage') interfaceLanguage: Languages) {
        CreateReplyAction(ctx, 'SIGN_UP.SELECT_NATIVE_LANGUAGE', interfaceLanguage, 'button', LanguageJsonFormat);
    }

    @CreateSelectButtonComposer('nativeLanguage', LanguageJsonFormat, false)
    @ModifyParams()
    afterSelectNativeLanguage(ctx: TelegramContext, @TransformLanguage('interfaceLanguage') interfaceLanguage: Languages) {
        CreateReplyAction(ctx, 'SIGN_UP.INPUT_NAME', interfaceLanguage);
    }

    @CreateTextComposer('name')
    @Apply({middlewares: [], possibleErrors: []})
    @ModifyParams()
    async afterInputName(
        ctx: TelegramContext,
        @TransformLanguage('nativeLanguage') nativeLanguage: Languages,
        @TransformLanguage('interfaceLanguage') interfaceLanguage: InterfaceLanguages
    ) {

        await userService.insert({
            idTelegram: ctx.session['idTelegram'],
            name: ctx.scene.states.name,
            interfaceLanguage: interfaceLanguage,
            nativeLanguage: nativeLanguage
        });

        CreateFinishReplyAction(ctx, 'SIGN_UP.SUCCESS_REGISTERED', interfaceLanguage);
    }
}