import { DataRecord, JaroWinklerDistance, WordNet } from 'natural';

class SimilarityDetectorService {
    #wordNet = new WordNet();

    async #getSynonyms(s: string) {
        return new Promise((resolve, reject) => {
            this.#wordNet.lookup(s, res => {
                const synonyms = res
                    .map(record => {
                        return record.synonyms.map(syn => syn.replace(/_/g, ' '))
                    })
                    .reduce((acc, syn) => [...acc, ...syn], []);

                resolve(new Set(synonyms));
            })
        });
    }

    detect(s1: string, s2: string) {
        if(s1.length/s2.length > 0.8) {
            if(s2.includes(s1) || s1.includes(s2)) {
                return true;
            }
        }

        const result = JaroWinklerDistance(s1, s2);

        return result >= 0.90;
    }

    async detectWithSynonyms(s1: string, s2: string) {
        const synonyms = await this.#getSynonyms(s2) as Set<string>;

        for(const synonym of synonyms) {
            if(this.detect(s1, synonym)) {
                return true;
            }
        }

        return false;
    }
}

export const similarityDetectorService = new SimilarityDetectorService();
