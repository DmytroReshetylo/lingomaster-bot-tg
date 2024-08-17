import { JaroWinklerDistance, WordNet } from 'natural';

class SimilarityDetectorService {

    async #getSynonyms(s: string) {
        return new Promise((resolve, reject) => {
            
        });
    }

    detect(s1: string, s2: string) {
        const result = JaroWinklerDistance(s1, s2);

        return result >= 0.90;
    }

    detectWithSynonyms(s1: string, s2: string) {

    }
}

export const similarityDetectorService = new SimilarityDetectorService();
