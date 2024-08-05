import DetectLanguage, { DetectionResult } from 'detectlanguage';
import { Languages } from '../../../core/language-interface/enums';
const DetectLanguageConnection = require('detectlanguage');

class LanguageDetectorService {
    #detectlanguage: DetectLanguage | null = null;

    connect() {
        this.#detectlanguage = new DetectLanguageConnection(process.env.detect_language as string);

        console.log('Detect language was connected!');
    }

    async detect(s: string, needLanguage: Languages): Promise<boolean>{
        const result: DetectionResult[] = await this.#detectlanguage!.detect(s);

        return !!result.find((e) => {
            if(Languages[e.language as keyof typeof Languages] == needLanguage) {
                return true;
            }
        });
    }
}

export const languageDetectorService = new LanguageDetectorService();

