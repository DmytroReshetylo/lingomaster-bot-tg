import { photoGeneratorService } from '../ai';
import { ServiceLearning } from '../database/abstract-services/service-learning.abstract-class';
import { User } from '../database/entities/user/user.entity';
import { userService } from '../database/entities/user/user.service';
import { EntityLearningType, JSONLearning } from '../database/types/entity-learning.type';
import { imgurService } from '../imgur';
import { PhotoManagerSubscribers } from './photo-manager.subscribers';

class PhotoManagerService {
    #listActive: string[] = [];
    #generateAllUsersActive: boolean = false;

    async generatePhotoDescriptorsForUser<
        T extends JSONLearning,
        TT extends EntityLearningType<T>
    >(
        user: User,
        service: ServiceLearning<T, TT, keyof T>,
        entity: TT
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

        await service.updateFullRecords(user, entity.language, service.getJSON(entity))

        this.#listActive = this.#listActive.filter(idTelegram => idTelegram !== user.idTelegram);
    }

    async generatePhotoDescriptorsForAll() {
        if(this.#generateAllUsersActive) {
            return;
        }

        this.#generateAllUsersActive = true;

        const users = await userService.getAll();

        for(const user of users) {
            for(const service of PhotoManagerSubscribers) {

                const entities = await service.getEntities({user});

                if(!entities.length) continue;

                for(const entity of entities) {
                    await this.generatePhotoDescriptorsForUser(user, service, entity);
                }
            }
        }

        this.#generateAllUsersActive = false;
    }
}

export const photoManagerService = new PhotoManagerService();