import Groq from 'groq-sdk';
import { Languages } from '../../../core/language-interface/enums';
import { TextFormat } from '../../commands/ai-text/scenes/shared/enums';

class TextGeneratorService {
    #client = new Groq({apiKey: process.env['groq_api_key']});

    async generateText(topic: string, format: TextFormat, words: string[], language: Languages) {
        try {
            const chatCompletion = await this.#client.chat.completions.create({
                messages: [{ role: 'user', content: `Please generate a text in ${language} about ${topic} in format ${format} where are words as ${words.join(', ')} have brackets as []. Your reply must be only the text without title`}],
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

    async splitText(text: string) {
        try {

            const chatCompletion = await this.#client.chat.completions.create({
                messages: [
                    {
                        role: 'user',
                        content: `I need to split the text '${text}' in JSON format {sentence: string, word: string}. The word is a part of the text enclosed in brackets [ ]. In the sentence, the part included in word should be replaced by _____ and any other text enclosed in brackets should have the brackets removed. Word and sentence can't be empty. In reply must be only JSON`
                    }
                ],
                model: 'llama-3.1-70b-versatile',
            });

            if (typeof chatCompletion.choices[0].message.content !== 'string') {
                return null;
            }

            return JSON.parse(chatCompletion.choices[0].message.content) as { sentence: string, word: string }[];
        } catch(err: any) {
            return null;
        }
    }

}

export const textGeneratorService = new TextGeneratorService();