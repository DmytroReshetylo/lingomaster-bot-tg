import { ImgurClient } from 'imgur';

require('dotenv').config();

class ImgurService {
    #client = new ImgurClient({accessToken: process.env.imgur_token as string});

    async upload(photo_url: string) {
        const result = await this.#client.upload({
            image: photo_url,
            type: 'url'
        });

        return result.data.link;
    }
}

export const imgurService = new ImgurService();