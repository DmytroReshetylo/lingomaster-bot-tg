import { similarityDetectorService } from '../../services/similarity-detector';
import { ShowTestDataFormat } from '../word-formats/types';
import { AnswerResult } from './enums';

export class TestAnswerHandler {

    async check(answer: string, displayFormat: ShowTestDataFormat) {
        switch (true) {
            case(answer.trim().toLowerCase() === displayFormat.backSide.trim().toLowerCase()): {
                return {correct: true, message: AnswerResult.Correct};
            }
            case(await similarityDetectorService.detectAI(answer, displayFormat.backSide)): {
                return {correct: true, message: AnswerResult.AlmostCorrect};
            }
            case(await similarityDetectorService.detectWithSynonyms(answer, displayFormat.backSide)): {
                return {correct: true, message: AnswerResult.Synonym};
            }
            default: return {correct: false, message: AnswerResult.Incorrect};
        }
    }
}