import { TelegramContext } from '../../../core/ctx.class';
import { translate } from '../../../core/language-interface/translate.alghoritm';
import { createButtonKeyboard } from '../../../core/telegram-utils';
import { VocabularyManaging } from '../classes';
import { transformLanguageToJsonFormat, transformToButtonActions } from '../utils';

export function SelectLanguageAction(ctx: TelegramContext, vocabularyManaging: VocabularyManaging, needSelected: boolean ) {
    const languages = needSelected ? vocabularyManaging.getSelectedLanguagesWithoutNative() : vocabularyManaging.getNotSelectedLanguages();

    if(needSelected && !languages.length) {
        ctx.reply(translate('MIDDLEWARES.IS_NOT_LEARN_ANY_LANGUAGE', ctx.session['user'].interfaceLanguage));

        ctx.scene.leaveScene();
    }
    else if(!needSelected && !languages.length) {
        ctx.reply(translate('MIDDLEWARES.ALL_LANGUAGES_ALREADY_STUDY', ctx.session['user'].interfaceLanguage));

        return ctx.scene.leaveScene();
    }
    else {
        ctx.reply(
            translate('INFO.CHOOSE_LANGUAGE', ctx.session['user'].interfaceLanguage),
            createButtonKeyboard(
                transformToButtonActions(
                    [
                        ...transformLanguageToJsonFormat(needSelected ? vocabularyManaging.getSelectedLanguagesWithoutNative() : vocabularyManaging.getNotSelectedLanguages()),
                        'BUTTONS.CANCEL'
                    ],
                    ctx.session['user'].interfaceLanguage
                )
            )
        )

        ctx.scene.nextAction();
    }
}