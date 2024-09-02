import Groq from 'groq-sdk';
import { Languages } from '../../../core/language-interface/enums';
import { TextInfo } from '../database/entities/ai-text/types';

class WordInfoService {
    #client = new Groq({apiKey: process.env['groq_api_key']});

    async getWordInfo(word: string, language: Languages) {
        try {
            const chatCompletion = await this.#client.chat.completions.create({
                messages: [{ role: 'user', content: `Please give me information about a word or phase like ${word} in ${language} in JSON format as {word: string; meaning: string, synonyms: string[]}. Your reply must be only the JSON`}],
                model: 'llama-3.1-70b-versatile',
            });

            if(typeof chatCompletion.choices[0].message.content !== 'string') {
                throw new Error('MIDDLEWARES.AI_ERROR');
            }

            return JSON.parse(chatCompletion.choices[0].message.content as string) as TextInfo[];
        }
        catch (err: any) {
            throw new Error('MIDDLEWARES.AI_ERROR');
        }
    }

    async getTranslate(word: string, language: Languages) {
        try {
            const chatCompletion = await this.#client.chat.completions.create({
                messages: [{ role: 'user', content: `Please write meaning a word like ${word} in ${language}. Your reply must be only the meaning`}],
                model: 'llama-3.1-70b-versatile',
            });

            if(typeof chatCompletion.choices[0].message.content !== 'string') {
                throw new Error('MIDDLEWARES.AI_ERROR');
            }

            return chatCompletion.choices[0].message.content as string;
        }
        catch (arr: any) {
            throw new Error('MIDDLEWARES.AI_ERROR');
        }
    }

    async getTranslations(words: string[], language: Languages) {
        try {
            const chatCompletion = await this.#client.chat.completions.create({
                messages: [{ role: 'user', content: `Please write deep meaning words or phrases like ${words.join(', ')} in ${language} in JSON format as {word: string, translate: string, photoUrl: null}. Your reply must be only the JSON`}],
                model: 'llama-3.1-70b-versatile'
            });

            if(typeof chatCompletion.choices[0].message.content !== 'string') {
                throw new Error('MIDDLEWARES.AI_ERROR');
            }

            return JSON.parse(chatCompletion.choices[0].message.content as string) as TextInfo[];
        }
        catch (arr: any) {
            throw new Error('MIDDLEWARES.AI_ERROR');
        }
    }
}

export const wordInfoService = new WordInfoService();