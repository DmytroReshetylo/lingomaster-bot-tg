import { similarityDetectorService } from '../../services/similarity-detector';
import { ShowTestDataFormat } from '../word-formats/types';
import { AnswerResult } from './enums';

export class TestAnswerHandler {

    async check(answer: string, displayFormat: ShowTestDataFormat) {
        switch (true) {
            case(answer === displayFormat.backSide): {
                return AnswerResult.Correct;
            }
            case(similarityDetectorService.detect(answer, displayFormat.backSide)): {
                return AnswerResult.AlmostCorrect;
            }
            case(await similarityDetectorService.detectWithSynonyms(answer, displayFormat.backSide)): {
                return AnswerResult.Synonym;
            }
            default: return AnswerResult.Incorrect;
        }
    }
}