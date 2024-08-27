import { photoGeneratorService } from '../ai';
import { User } from '../database/user/user.entity';
import { userService } from '../database/user/user.service';
import { Vocabulary } from '../database/vocabulary/vocabulary.entity';
import { vocabularyService } from '../database/vocabulary/vocabulary.service';
import { imgurService } from '../imgur';

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
                const url = await photoGeneratorService.generate(flashcardNoPhoto.word);

                if(url) {
                    flashcardNoPhoto.photoUrl = await imgurService.upload(url);
                }

                console.log(flashcardNoPhoto.photoUrl);

            }catch (err: any) {}
        }

        await vocabularyService.update(
            {user, language: vocabulary.language},
            {flashcards: vocabulary.flashcards}
        );

        this.#listActive = this.#listActive.filter(idTelegram => idTelegram !== user.idTelegram);
    }

    async generatePhotoDescriptorsForAll() {
        if(this.#generateAllUsersActive) {
            return;
        }

        this.#generateAllUsersActive = true;

        const users = await userService.getAll();

        for(const user of users) {
            const vocabularies = await vocabularyService.getEntities({user});

            if(!vocabularies) continue;

            for(const vocabulary of vocabularies) {
                await this.generatePhotoDescriptorsForUser(user, vocabulary);
            }
        }

        this.#generateAllUsersActive = false;
    }
}

export const photoManagerService = new PhotoManagerService();