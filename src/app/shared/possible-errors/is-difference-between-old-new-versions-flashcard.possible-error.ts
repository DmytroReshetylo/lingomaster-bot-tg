export function IsDifferenceBetweenOldNewVersionsFlashcardPossibleError(error: any) {
    if(typeof error.message === 'string' && error.message.includes('VALIDATORS.NOT_DIFFERENCE_OLD_NEW_VER_FLASHCARD')) {
        return 'VALIDATORS.NOT_DIFFERENCE_OLD_NEW_VER_FLASHCARD';
    }

    return null;
}