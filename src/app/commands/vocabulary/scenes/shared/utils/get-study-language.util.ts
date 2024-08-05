import { Vocabulary } from '../../../../../services/database/vocabulary/vocabulary.entity';

export function getStudyLanguage(vocabularies: Vocabulary[]) {
    return vocabularies.map(vocabulary => vocabulary.language);
}