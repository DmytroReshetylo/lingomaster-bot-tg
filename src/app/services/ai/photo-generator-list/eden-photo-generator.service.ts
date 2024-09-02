import { PhotoGeneratorConfig } from '../configs';
import { PhotoGenerator } from '../types';

const axios = require("axios").default;

class EdenPhotoGeneratorService implements PhotoGenerator {
    async generate(word: string) {

        const options = {
            method: 'post',
            url: 'https://api.edenai.run/v2/image/generation',
            headers: {
                authorization: `Bearer ${process.env.eden_api_key}`,
            },
            data: {
                providers: 'replicate/classic',
                text: PhotoGeneratorConfig.prompt(word),
                resolution: '512x512',
                num_images: 1
            },
        };

        const result = await axios.request(options);

        if(result.data.status === 'fail') {
            return null;
        }

        return (result.data['replicate/classic'].items[0] as any).image_resource_url as string;
    }
}

export const edenPhotoGeneratorService = new EdenPhotoGeneratorService();