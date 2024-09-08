import Groq from 'groq-sdk';
import { JaroWinklerDistance } from 'natural';

class SimilarityDetectorService {
    #client = new Groq({apiKey: process.env['groq_api_key']});

    detect(s1: string, s2: string) {
        const result = JaroWinklerDistance(s1, s2);
        return result >= 0.90;
    }

    async detectAI(s1: string, s2: string) {
        try {
            const chatCompletion = await this.#client.chat.completions.create({
                messages: [{ role: 'user', content: `Check if the two words '{${s1})' and '{${s2}}' are different forms of the same word. In reply return ONLY 1 if true, 0 if false.`}],
                model: 'llama-3.1-70b-versatile',
            });

            if(typeof chatCompletion.choices[0].message.content !== 'string') {
                return false;
            }

            return !!Number(chatCompletion.choices[0].message.content);
        }
        catch (arr: any) {
            return false;
        }
    }

    async detectWithSynonyms(s1: string, s2: string) {
        try {
            const chatCompletion = await this.#client.chat.completions.create({
                messages: [{ role: 'user', content: `Check if the two words '{${s1}}' and '{${s2}}' have the same meaning. In reply return ONLY 1 if true, 0 if false.`}],
                model: 'llama-3.1-70b-versatile',
            });

            if(typeof chatCompletion.choices[0].message.content !== 'string') {
                return false;
            }

            return !!Number(chatCompletion.choices[0].message.content);
        }
        catch (arr: any) {
            return false;
        }
    }
}

export const similarityDetectorService = new SimilarityDetectorService();
