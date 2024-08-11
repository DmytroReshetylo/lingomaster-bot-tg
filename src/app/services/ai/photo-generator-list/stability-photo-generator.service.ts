import { generateAsync } from 'stability-client';
import { PhotoGeneratorConfig } from '../configs';
import { PhotoGenerator } from './types';

class StabilityPhotoGeneratorService implements PhotoGenerator {

    async generate(word: string) {
        try {
            const result:any = await generateAsync({
                prompt: PhotoGeneratorConfig.prompt(word),
                apiKey: process.env.stability_api_key as string,
                samples: 1,
                engine: 'stable-diffusion-512-v2-1',
                width: 512,
                height: 512,
                steps: 10,
            })

            return result.images[0].filePath;
        }
        catch (err: any) {
            return null;
        }
    }
}

export const stabilityPhotoGeneratorService = new StabilityPhotoGeneratorService();