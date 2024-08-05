import { dbConnection } from '../db.connection';
import { Languages } from '../../../../core/language-interface/enums';
import { Flashcard } from './types';
import { Vocabulary } from './vocabulary.entity';
import { User } from '../user/user.entity';

export class VocabularyService {
    #vocabularyRepository = dbConnection.getRepository(Vocabulary);

    async getAll() {
        return await this.#vocabularyRepository.find();
    }

    async getAllVocabulary(user: User) {
        const result = await this.#vocabularyRepository.find({where: {user}});

        if(!result.length) {
            return null;
        }

        return result;
    }

    async getVocabulary(user: User, language: Languages) {
        const result = await this.getAllVocabulary(user);

        if(!result) {
            return result;
        }

        const neededVocabulary = result.find(vocabulary => vocabulary.language === language);

        if(!neededVocabulary) {
            return null;
        }

        return neededVocabulary;
    }

    async addVocabulary(user: User, language: Languages) {
        await this.#vocabularyRepository.insert({user, language, flashcards: []})
    }

    async createVocabulary(user: User, language: Languages, flashcards: Flashcard[]) {
        await this.#vocabularyRepository.insert({user, language, flashcards});
    }

    // async addToVocabulary(user: User, language: Languages, flashcards: Flashcard[]) {
    //     // const vocabulary = await this.getVocabulary(user, language) as Vocabulary;
    //     //
    //     // flashcards = flashcards
    //     //     .filter((flashcard) => !vocabulary.flashcards
    //     //         .find(vocFlashcard => flashcard.word === vocFlashcard.word))
    //     //
    //     // flashcards = [...vocabulary.flashcards, ...flashcards];
    //
    //     await this.#vocabularyRepository.update({user, language}, {flashcards});
    // }

    async updateFlashcards(user: User, language: Languages, flashcards: Flashcard[]) {
        // const vocabulary = await this.getVocabulary(user, language) as Vocabulary;
        //
        // const findFlashcard = vocabulary.flashcards
        //     .find(vocFlashcard => vocFlashcard.word === flashcard.word) as Flashcard;
        //
        // findFlashcard.word = flashcard.word;
        // findFlashcard.translate = flashcard.translate;
        // findFlashcard.progress = flashcard.progress;

        await this.#vocabularyRepository.update({user, language}, {flashcards});
    }

    // async deleteFlashcards(user: User, language: Languages, flashcards: Flashcard[]) {
    //     const vocabulary = await this.getVocabulary(user, language) as Vocabulary;
    //
    //     vocabulary.flashcards = vocabulary.flashcards.map(vocFlashcard => {
    //         const findFlashcard = flashcards
    //             .find(flashcard => vocFlashcard.word === flashcard.word) ;
    //
    //         if(findFlashcard) {
    //             vocFlashcard.word = findFlashcard.word;
    //             vocFlashcard.translate = findFlashcard.translate;
    //             vocFlashcard.progress = findFlashcard.progress;
    //         }
    //
    //         return vocFlashcard;
    //     })
    //
    //     await this.#vocabularyRepository.update({user, language}, {flashcards: vocabulary.flashcards});
    // }
}

export const vocabularyService = new VocabularyService();