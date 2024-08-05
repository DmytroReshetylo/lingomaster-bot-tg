import { validate, ValidationError } from 'class-validator';

export async function checkValid(obj: any) {
    const result = await validate(obj);

    if(!result.length) {
        return;
    }

    const errors:any[] = result.reduce((acc:any[], error:ValidationError) => [
        ...acc, ...Object.values(error.constraints!)
    ], []);

    throw new Error(JSON.stringify(errors));
}