import { edenPhotoGeneratorService, hercaiPhotoGeneratorService, stabilityPhotoGeneratorService } from './photo-generator-list';
import { PhotoGenerator } from './types';

class PhotoGeneratorService implements PhotoGenerator {
    #listPhotoGenerators: PhotoGenerator[] = [
        hercaiPhotoGeneratorService,
        stabilityPhotoGeneratorService,
        edenPhotoGeneratorService,
    ]

    async generate(word: string) {
        for(const photoGenerator of this.#listPhotoGenerators) {
            const result = await photoGenerator.generate(word);

            if(result) {
                return result;
            }
        }

        return null;
    }
}

export const photoGeneratorService = new PhotoGeneratorService();