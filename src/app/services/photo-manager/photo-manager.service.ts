import { photoGeneratorService } from '../ai';
import { User } from '../database/user/user.entity';
import { userService } from '../database/user/user.service';
import { Vocabulary } from '../database/vocabulary/vocabulary.entity';
import { vocabularyService } from '../database/vocabulary/vocabulary.service';

class PhotoManagerService {
    #listActive: string[] = [];
    #generateAllUsersActive: boolean = false;

    async generatePhotoDescriptorsForUser(user: User, vocabulary: Vocabulary) {
        if(this.#listActive.includes(user.idTelegram)) {
            return;
        }

        this.#listActive.push(user.idTelegram);

        const flashcardsNoPhoto = vocabulary.flashcards.filter(flashcard => !flashcard.photoUrl);

        for(const flashcardNoPhoto of flashcardsNoPhoto) {
            try {
                flashcardNoPhoto.photoUrl = await photoGeneratorService.generate(flashcardNoPhoto.word);

                console.log(flashcardNoPhoto.photoUrl);

            }catch (err: any) {}
        }

        await vocabularyService.updateFlashcards(user, vocabulary.language, vocabulary.flashcards);

        this.#listActive = this.#listActive.filter(idTelegram => idTelegram !== user.idTelegram);
    }

    async generatePhotoDescriptorsForAll() {
        if(this.#generateAllUsersActive) {
            return;
        }

        this.#generateAllUsersActive = true;

        const users = await userService.getAll();

        for(const user of users) {
            const vocabularies = await vocabularyService.getAllVocabulary(user);

            if(!vocabularies) continue;

            for(const vocabulary of vocabularies) {
                await this.generatePhotoDescriptorsForUser(user, vocabulary);
            }
        }

        this.#generateAllUsersActive = false;
    }
}

export const photoManagerService = new PhotoManagerService();