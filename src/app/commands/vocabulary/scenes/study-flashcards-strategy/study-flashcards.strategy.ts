import { Languages } from '../../../../../core/language-interface/enums';
import { User } from '../../../../services/database/user/user.entity';
import { Flashcard } from '../../../../services/database/vocabulary/types';
import { vocabularyService } from '../../../../services/database/vocabulary/vocabulary.service';
import { ProgressFailedChanges } from './constants';
import { RandomFlashcardSide } from './utils';
import { GetFlashcardPriorityList } from './utils';
import { ShowFlashcardFormatFunc } from './utils/types';

export class StudyFlashcardsStrategy {
    #user: User;
    #flashcards: Flashcard[];
    #language: Languages;
    #showNextFlashcard: ShowFlashcardFormatFunc;

    #queueFlashcards: number[] = [];
    #queueFailedFlashcards: number[] = [];

    #priorityListFunc = GetFlashcardPriorityList();

    constructor(
        user: User,
        language: Languages,
        flashcards: Flashcard[],
        showNextFlashcard: ShowFlashcardFormatFunc
    ) {
        this.#user = user;
        this.#flashcards = flashcards;
        this.#language = language;
        this.#showNextFlashcard = showNextFlashcard;

        this.#startRound();
    }

    #startRound() {
        this.#queueFlashcards = this.#flashcards.map((v, index) => index);
    }

    async #sendProgress() {
        await vocabularyService.updateFlashcards(this.#user, this.#language, this.#flashcards);
    }

    changeProgress(index: number, success: boolean) {
        const flashcard = this.#flashcards[index];

        this.#queueFlashcards = this.#queueFlashcards.filter(i => i !== index);

        if(success) {
            flashcard.progress = flashcard.progress === 10 ? flashcard.progress : flashcard.progress + 1;

            this.#queueFailedFlashcards = this.#queueFailedFlashcards.filter(i => i !== index);
        } else {
            flashcard.progress = flashcard.progress === 0 ? flashcard.progress : ProgressFailedChanges[flashcard.progress];

            if(!this.#queueFailedFlashcards.includes(index)) {
                this.#queueFailedFlashcards.push(index);
            }
        }
    }

    getNextFlashcard() {
        if((this.#flashcards.length - this.#queueFlashcards.length) % 3 === 0) {
            this.#sendProgress();
        }

        if(!this.#queueFlashcards.length && !this.#queueFailedFlashcards.length) {
            this.#startRound();
        }

        for(const getFlashcard of this.#priorityListFunc) {
            const flashcard = getFlashcard(this.#flashcards, this.#queueFlashcards, this.#queueFailedFlashcards);

            if(flashcard) {
                return this.#showNextFlashcard({
                    index: this.#flashcards.findIndex(fl => fl.word === flashcard.word),
                    rightFlashcard: flashcard,
                    flashcards: this.#flashcards,
                    showSide: RandomFlashcardSide()
                })
            }
        }

        return null;
    }
}