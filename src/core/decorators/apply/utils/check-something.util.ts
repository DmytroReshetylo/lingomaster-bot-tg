
export async function checkSomething(sth: any, listFunc: ((sth: any) => (null | string) | Promise<null | string>)[]): Promise<string | null> {
    for(const func of listFunc) {
        const result = await func(sth);

        if(result) {
            return result as string;
        }
    }

    return null;
}