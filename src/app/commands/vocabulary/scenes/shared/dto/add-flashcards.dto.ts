import { Validate } from 'class-validator';
import { Languages } from '../../../../../../core/language-interface/enums';
import { Flashcard } from '../../../../../services/database/vocabulary/types';
import { IsLanguageValid } from './custom-validators';

export class AddFlashcardDto {
    @Validate(IsLanguageValid)
    word!: string;

    translate!: string;

    wordLanguage!: Languages;

    toFlashcardFormat(): Flashcard {
        return {
            word: this.word,
            translate: this.translate,
            progress: 0,
            photoUrl: null
        }
    }
}