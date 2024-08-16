import { JaroWinklerDistance } from 'natural';

class SimilarityDetectorService {
    detect(s1: string, s2: string) {
        const result = JaroWinklerDistance(s1, s2);

        return result >= 0.90;
    }
}

export const similarityDetectorService = new SimilarityDetectorService();
