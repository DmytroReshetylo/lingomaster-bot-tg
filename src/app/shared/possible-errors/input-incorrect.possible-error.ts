export function InputIncorrectPossibleError(error: any) {
    return error.message === 'VALIDATORS.INCORRECT_FORMAT_INPUT' ? 'VALIDATORS.INCORRECT_FORMAT_INPUT' : null;
}