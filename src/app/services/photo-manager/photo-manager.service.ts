import { photoGeneratorService } from '../ai';
import { ServiceLearning } from '../database/abstract-services/service-learning.abstract-class';
import { studyLanguageService } from '../database/entities/study-languages/study-language.service';
import { EntityLearningType, JSONLearning } from '../database/types/entity-learning.type';
import { imgurService } from '../imgur';
import { PhotoManagerSubscribers } from './photo-manager.subscribers';

class PhotoManagerService {
    #listActive: number[] = [];
    #generateAllUsersActive: boolean = false;

    async generatePhotoDescriptorsForUser<T extends JSONLearning>(
        service: ServiceLearning<T, EntityLearningType<T>, keyof T>,
        entity: EntityLearningType<T>,
    ) {
        if(this.#listActive.includes(entity.id)) {
            return;
        }

        this.#listActive.push(entity.id);

        try {
            const dataWithoutPhoto = service.getJSON(entity).filter(data => !data.photoUrl);

            for(const data of dataWithoutPhoto) {
                try {
                    const url = await photoGeneratorService.generate(service.getDataDifferenceValue(data));

                    if(url) {
                        data.photoUrl = await imgurService.upload(url);
                    }

                    console.log(data.photoUrl);

                }
                catch (err: any) {}
            }

            await service.updateFullRecords({id: entity.id}, service.getJSON(entity))

        } catch (err: any) {
            console.log(err);
            console.log(service, entity)
        }


        this.#listActive = this.#listActive.filter(id => id !== entity.id);
    }

    async generatePhotoDescriptorsForAll() {
        if(this.#generateAllUsersActive) {
            return;
        }

        this.#generateAllUsersActive = true;

        const studyLanguageEntities = await studyLanguageService.getAll();

        for(const studyLanguageEntity of studyLanguageEntities) {
            for(const service of PhotoManagerSubscribers) {

                const entities = await service.getEntities({studyLanguages: {id: studyLanguageEntity.id}});

                if(!entities.length) continue;

                for(const entity of entities) {
                    await this.generatePhotoDescriptorsForUser(service, entity);
                }
            }
        }

        this.#generateAllUsersActive = false;
    }
}

export const photoManagerService = new PhotoManagerService();