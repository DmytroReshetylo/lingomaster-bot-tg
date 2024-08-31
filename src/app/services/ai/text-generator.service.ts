import Groq from 'groq-sdk';
import { Languages } from '../../../core/language-interface/enums';

class TextGeneratorService {
    #client = new Groq({apiKey: process.env['groq_api_key']});

    async generateStory(topic: string, words: string[], language: Languages) {
        try {
            const chatCompletion = await this.#client.chat.completions.create({
                messages: [{ role: 'user', content: `Please generate a story in ${language} about ${topic} where are words as ${words.join(', ')} have brackets as []. Your reply must be only the story`}],
                model: 'llama-3.1-70b-versatile',
            });

            if(typeof chatCompletion.choices[0].message.content !== 'string') {
                return null;
            }

            return chatCompletion.choices[0].message.content as string;
        }
        catch (arr: any) {
            return null;
        }
    }

}

export const textGeneratorService = new TextGeneratorService();