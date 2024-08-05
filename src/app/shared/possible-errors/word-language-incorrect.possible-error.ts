export function WordLanguageIncorrectPossibleError(error: any) {
    if(typeof error.message === 'string' && error.message.includes('VALIDATORS.WORD_INCORRECT_LANGUAGE')) {
        return 'VALIDATORS.WORD_INCORRECT_LANGUAGE';
    }

    return null;
}