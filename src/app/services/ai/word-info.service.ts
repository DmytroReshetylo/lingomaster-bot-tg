import Groq from 'groq-sdk';
import { Languages } from '../../../core/language-interface/enums';
import { WordInfo } from './types';

class WordInfoService {
    #client = new Groq({apiKey: process.env['groq_api_key']});

    async getWordInfo(word: string, language: Languages) {
        try {
            const chatCompletion = await this.#client.chat.completions.create({
                messages: [{ role: 'user', content: `Please give me information about a word or phase like ${word} in ${language} in JSON format as {word: string; meaning: string, synonyms: string[]}. Your reply must be only the JSON`}],
                model: 'llama-3.1-70b-versatile',
            });

            if(typeof chatCompletion.choices[0].message.content !== 'string') {
                return null;
            }

            return JSON.parse(chatCompletion.choices[0].message.content) as WordInfo[];
        }
        catch (err: any) {
            return null;
        }
    }

    async getTranslate(word: string, language: Languages) {
        try {
            const chatCompletion = await this.#client.chat.completions.create({
                messages: [{ role: 'user', content: `Please write meaning a word like ${word} in ${language}. Your reply must be only the meaning`}],
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

    async getTranslations(words: string[], language: Languages) {
        try {
            const chatCompletion = await this.#client.chat.completions.create({
                messages: [{ role: 'user', content: `Please write meaning words or phrases like ${words.join(', ')} in ${language} in JSON format as {word: string, translate: string}. Your reply must be only the JSON`}],
                model: 'llama-3.1-70b-versatile',
            });

            if(typeof chatCompletion.choices[0].message.content !== 'string') {
                return null;
            }

            return JSON.parse(chatCompletion.choices[0].message.content) as {word: string, translate: string}[];
        }
        catch (arr: any) {
            return null;
        }
    }
}

export const wordInfoService = new WordInfoService();