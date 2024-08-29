import { Validate } from 'class-validator';
import { Languages } from '../../../../../../core/language-interface/enums';
import { Flashcard } from '../../../../../services/database/entities/vocabulary/types';
import { similarityDetectorService } from '../../../../../services/similarity-detector';
import { IsLanguageValid, IsNotSameOldAndNewVersionFlashcard } from './custom-validators';

export class ChangeFlashcardDto {
    @Validate(IsLanguageValid)
    @Validate(IsNotSameOldAndNewVersionFlashcard)
    word!: string;

    wordLanguage!: Languages;

    @Validate(IsNotSameOldAndNewVersionFlashcard)
    translate!: string;

    oldFlashcardVersion!: Flashcard;

    toFlashcardFormat(): Flashcard {
        return {
            word: this.word,
            translate: this.translate,
            progress: this.oldFlashcardVersion.progress,
            photoUrl: similarityDetectorService.detect(this.word, this.oldFlashcardVersion.word) ? this.oldFlashcardVersion.photoUrl : null
        }
    }
}