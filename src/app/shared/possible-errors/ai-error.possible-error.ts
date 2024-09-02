export function AiErrorPossibleError(error: any) {
    return error.message === 'ERRORS.AI_ERROR' ? 'ERRORS.AI_ERROR' : null;
}