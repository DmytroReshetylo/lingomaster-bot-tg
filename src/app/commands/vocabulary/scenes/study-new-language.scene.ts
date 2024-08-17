import { TelegramContext } from '../../../../core/ctx.class';
import { Scene } from '../../../../core/decorators/scene/types';
import { InterfaceLanguages, Languages } from '../../../../core/language-interface/enums';
import { translate } from '../../../../core/language-interface/translate.alghoritm';
import { createButtonKeyboard } from '../../../../core/telegram-utils';
import { CreateSelectButtonComposer } from '../../../../core/decorators/scene/composers';
import { vocabularyService } from '../../../services/database/vocabulary/vocabulary.service';
import { IsNotLearningLanguageMiddleware } from '../../../shared/middlewares';
import { getNavigationButtons, transformLanguageToJsonFormat, transformToButtonActions } from '../../../shared/utils';
import { Apply, CreateScene } from '../../../../core';
import { Vocabulary } from '../../../services/database/vocabulary/vocabulary.entity';

@CreateScene('vocabulary-study-new-language-scene')
export class VocabularyStudyNewLanguageScene implements Scene {

    @Apply({middlewares: [], possibleErrors: []})
    async start(ctx: TelegramContext) {
        const selectedLanguages = [
                ...ctx.session['vocabularies'].map((vocabulary: Vocabulary) => vocabulary.language),
            ctx.session['user'].nativeLanguage
        ];

        const notSelectedLanguages = Object.values(Languages)
            .filter(language => !selectedLanguages.includes(language as Languages)) as Languages[];

        if(!notSelectedLanguages.length) {
            ctx.reply(translate('MIDDLEWARES.ALL_LANGUAGES_ALREADY_STUDY', ctx.session['user'].interfaceLanguage));

            return ctx.scene.leaveScene();
        }

        ctx.reply(
            translate('INFO.CHOOSE_LANGUAGE', ctx.session['user'].interfaceLanguage),
            createButtonKeyboard(
                transformToButtonActions(
                    [...transformLanguageToJsonFormat(notSelectedLanguages), 'BUTTONS.CANCEL'],
                    ctx.session['user'].interfaceLanguage
                )
            )
        );

        ctx.scene.nextAction();
    }

    @CreateSelectButtonComposer('language', transformLanguageToJsonFormat(Object.values(Languages) as Languages[]), true)
    @Apply({middlewares: [IsNotLearningLanguageMiddleware], possibleErrors: []})
    async afterSelectStudyLanguage(ctx: TelegramContext) {
        await vocabularyService.addVocabulary(
            ctx.session['user'],
            translate(ctx.scene.states.language, Languages.en) as InterfaceLanguages
        );

        ctx.session['vocabularies'] = await vocabularyService.getAllVocabulary(ctx.session['user']);

        ctx.reply(
            translate('VOCABULARY.STUDY_NEW_LANGUAGE.FINISHED', ctx.session['user'].interfaceLanguage),
            getNavigationButtons()
        );

        ctx.scene.leaveScene();
    }

}