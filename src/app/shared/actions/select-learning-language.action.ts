import { TelegramContext } from '../../../core/ctx.class';
import { translate } from '../../../core/language-interface/translate.alghoritm';
import { EntityNames } from '../../services/database/entities/entity-names';
import { StudyLanguageManaging } from '../classes';
import { transformLanguageToJsonFormat } from '../utils';
import { CreateReplyAction } from './create-reply.action';

export function SelectLanguageAction(ctx: TelegramContext, StudyLanguageManaging: StudyLanguageManaging, needSelected: boolean ) {
    const languages = needSelected ? StudyLanguageManaging.getSelectedLanguagesWithoutNative() : StudyLanguageManaging.getNotSelectedLanguages();

    if(needSelected && !languages.length) {
        ctx.reply(translate('MIDDLEWARES.IS_NOT_LEARN_ANY_LANGUAGE', ctx.session[EntityNames.User].interfaceLanguage));

        ctx.scene.leaveScene();
    }
    else if(!needSelected && !languages.length) {
        ctx.reply(translate('MIDDLEWARES.ALL_LANGUAGES_ALREADY_STUDY', ctx.session[EntityNames.User].interfaceLanguage));

        return ctx.scene.leaveScene();
    }
    else {
        const languages = needSelected ? StudyLanguageManaging.getSelectedLanguagesWithoutNative() : StudyLanguageManaging.getNotSelectedLanguages();

        CreateReplyAction(
            ctx,
            'INFO.CHOOSE_LANGUAGE',
            ctx.session[EntityNames.User].interfaceLanguage,
            'button',
            [...transformLanguageToJsonFormat(languages), 'BUTTONS.CANCEL']
        )
    }
}