import { TelegramContext } from '../../../core/ctx.class';
import { Languages } from '../../../core/language-interface/enums';
import { Vocabulary } from '../../services/database/entities/vocabulary/vocabulary.entity';
import { LanguagesList } from '../constants';

export class VocabularyManaging {
    #ctx: TelegramContext;

    constructor(ctx: TelegramContext) {
        this.#ctx = ctx;
    }

    getSelectedLanguages() {
        console.log(this.#ctx.session);

        return [
            ...this.#ctx.session['vocabularies'].map((vocabulary: Vocabulary) => vocabulary.language),
            this.#ctx.session['user'].nativeLanguage
        ] as Languages[];
    }

    getSelectedLanguagesWithoutNative() {
        return this.getSelectedLanguages().filter(language => language !== this.#ctx.session['user'].nativeLanguage) as Languages[];
    }

    getNotSelectedLanguages() {
        const selectedLanguages = this.getSelectedLanguages();

        return LanguagesList.filter(language => !selectedLanguages.includes(language as Languages)) as Languages[]
    }

    getVocabulary(language: Languages) {
        return this.#ctx.session['vocabularies'].find((voc: Vocabulary) => voc.language === language) as Vocabulary;
    }


}