import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { languageDetectorService } from '../../../../../../services/language-detector';

@ValidatorConstraint({ async: true })
export class IsLanguageValid implements ValidatorConstraintInterface {

    public async validate(value: any, args: any): Promise<boolean> {
        return await languageDetectorService.detect(args.object.word, args.object.wordLanguage);
    }

    public defaultMessage() {
        return 'VALIDATORS.WORD_INCORRECT_LANGUAGE';
    }

}