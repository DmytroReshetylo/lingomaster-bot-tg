import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ async: true })
export class IsNotSameOldAndNewVersionFlashcard implements ValidatorConstraintInterface {

    public async validate(value: any, args: any): Promise<boolean> {
        return !(args.object.word === args.object.oldFlashcardVersion.word && args.object.translate === args.object.oldFlashcardVersion.translate);
    }

    public defaultMessage() {
        return 'VALIDATORS.NOT_DIFFERENCE_OLD_NEW_VER_FLASHCARD';
    }

}