import { AIText } from '../../../../../services/database/entities/ai-text/text.entity';

export class TextManaging {
    private textEntity?: AIText;

    connectEntity(textEntity: AIText) {
        this.textEntity = textEntity;
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