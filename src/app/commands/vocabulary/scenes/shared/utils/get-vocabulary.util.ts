import { Languages } from '../../../../../../core/language-interface/enums';
import { StudyLanguages } from '../../../../../services/database/entities/study-languages/study-language.entity';

export function getVocabulary(studyLanguages: StudyLanguages[], language: Languages) {
    return studyLanguages.find((lan) => lan.language === language)!.vocabularies;
}