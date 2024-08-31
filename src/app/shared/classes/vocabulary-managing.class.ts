import { TelegramContext } from '../../../core/ctx.class';
import { Languages } from '../../../core/language-interface/enums';
import { EntityNames } from '../../services/database/entities/entity-names';
import { StudyLanguages } from '../../services/database/entities/study-languages/study-language.entity';
import { LanguagesList } from '../constants';

export class StudyLanguageManaging {
    #ctx: TelegramContext;

    constructor(ctx: TelegramContext) {
        this.#ctx = ctx;
    }

    getSelectedLanguages() {
        return [
            ...this.#ctx.session[EntityNames.StudyLanguages].map((st: StudyLanguages) => st.language),
            this.#ctx.session[EntityNames.User].nativeLanguage
        ] as Languages[];
    }

    getSelectedLanguagesWithoutNative() {
        return this.getSelectedLanguages().filter(language => language !== this.#ctx.session[EntityNames.User].nativeLanguage) as Languages[];
    }

    getNotSelectedLanguages() {
        const selectedLanguages = this.getSelectedLanguages();

        return LanguagesList.filter(language => !selectedLanguages.includes(language as Languages)) as Languages[]
    }

    findSelectedLanguage(language: Languages) {
        return (this.#ctx.session[EntityNames.StudyLanguages] as StudyLanguages[]).find((st: StudyLanguages) => st.language === language);
    }

    getVocabulary(language: Languages) {
        return (this.#ctx.session[EntityNames.StudyLanguages].find((st: StudyLanguages) => st.language === language) as StudyLanguages).vocabularies;
    }


}