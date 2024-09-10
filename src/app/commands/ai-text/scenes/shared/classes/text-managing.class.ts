import { AIText } from '../../../../../services/database/entities/ai-text/text.entity';
import { Fragment } from '../types';

export class TextManaging {
    private textEntity?: AIText;

    connectEntity(textEntity: AIText) {
        this.textEntity = textEntity;
    }

    splitText(text: string) {
        const sentences = text.split(']');

        return sentences.reduce((acc, sentence: string, index: number) => {

            switch(true) {
                case sentences.length - 1 === index: {
                    return acc;
                }
                case sentences.length - 2 === index: {
                    sentence = `${sentence.slice(0, sentence.indexOf('['))} _____ ${sentence.slice(sentence.indexOf('['))} ${sentences[index + 1]}`;

                    break;
                }
                default: {
                    sentence = `${sentence.slice(0, sentence.indexOf('['))} _____ ${sentences[index + 1].slice(0, sentences[index + 1].indexOf('['))}...`;
                }
            }

            return [
                ...acc,
                {
                    sentence: this.deleteBrackets(sentences.slice(0, index).join(' ')) + sentence,
                    word: sentences[index].slice(sentences[index].indexOf('[') + 1)
                }
            ];

        }, [] as Fragment[]) as Fragment[];
    }

    getFragmentWithFlashcard(idFlashcard: number) {
        return this.textEntity?.fragmentedText[idFlashcard];
    }

    replaceEmpty(fragment: string, replaceTo: string) {
        return fragment.replace(/_{2,}/g, `<u><b>${replaceTo}</b></u>`);
    }

    deleteBrackets(text: string) {
        return text.replace(/\[|\]/g, '');
    }
}