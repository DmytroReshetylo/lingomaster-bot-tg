export async function GetFirstReturn<T>(arg: T, foundArray: ((arg: T) => string | null)[]) {
    for(const obj of foundArray) {
        const result = obj(arg);

        if(result) {
            return result;
        }
    }

    return null;
}