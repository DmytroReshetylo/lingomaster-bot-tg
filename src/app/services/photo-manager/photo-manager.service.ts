import { photoGeneratorService } from '../ai';
import { ServiceLearning } from '../database/abstract-services/service-learning.abstract-class';
import { StudyLanguages } from '../database/entities/study-languages/study-language.entity';
import { studyLanguageService } from '../database/entities/study-languages/study-language.service';
import { User } from '../database/entities/user/user.entity';
import { EntityLearningType, JSONLearning } from '../database/types/entity-learning.type';
import { imgurService } from '../imgur';
import { PhotoManagerSubscribers } from './photo-manager.subscribers';

class PhotoManagerService {
    #listActive: string[] = [];
    #generateAllUsersActive: boolean = false;

    async generatePhotoDescriptorsForUser<T extends JSONLearning>(
        user: User,
        studyLanguageEntity: StudyLanguages,
        service: ServiceLearning<T, EntityLearningType<T>, keyof T>,
        entity: EntityLearningType<T>
    ) {
        if(this.#listActive.includes(user.idTelegram)) {
            return;
        }

        this.#listActive.push(user.idTelegram);

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

        await service.updateFullRecords(studyLanguageEntity, service.getJSON(entity))

        this.#listActive = this.#listActive.filter(idTelegram => idTelegram !== user.idTelegram);
    }

    async generatePhotoDescriptorsForAll() {
        if(this.#generateAllUsersActive) {
            return;
        }

        this.#generateAllUsersActive = true;

        const studyLanguageEntities = await studyLanguageService.getAll();

        for(const studyLanguageEntity of studyLanguageEntities) {
            for(const service of PhotoManagerSubscribers) {

                const entities = await service.getEntities({studyLanguageEntity});

                if(!entities.length) continue;

                for(const entity of entities) {
                    await this.generatePhotoDescriptorsForUser(studyLanguageEntity.user, studyLanguageEntity, service, entity);
                }
            }
        }

        this.#generateAllUsersActive = false;
    }
}

export const photoManagerService = new PhotoManagerService();