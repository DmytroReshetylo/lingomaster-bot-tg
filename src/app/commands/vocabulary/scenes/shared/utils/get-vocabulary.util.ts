import { Languages } from '../../../../../../core/language-interface/enums';
import { Vocabulary } from '../../../../../services/database/vocabulary/vocabulary.entity';

export function getVocabulary(vocabularies: Vocabulary[], language: Languages) {
    return vocabularies.find((voc) => voc.language === language) as Vocabulary;
}