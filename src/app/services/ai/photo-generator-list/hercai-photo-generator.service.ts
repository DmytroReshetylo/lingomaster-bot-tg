import { Hercai } from 'hercai';
import { PhotoGeneratorConfig } from '../configs';
import { PhotoGenerator } from '../types';

class HercaiPhotoGeneratorService implements PhotoGenerator {
    #herc = new Hercai();

    async generate(word: string) {
        try {
            const result = await this.#herc.drawImage({
                model: 'raava',
                prompt: PhotoGeneratorConfig.prompt(word),
                negative_prompt: PhotoGeneratorConfig.negative_prompt
            });

            if(!result.url) {
                return null;
            }

            return result.url;

        }catch (err: any) {
            console.log(err);
            return null;
        }
    }
}

export const hercaiPhotoGeneratorService = new HercaiPhotoGeneratorService();