export async function runSequentially(...funcs: Function[]) {
    for (const func of funcs) {
        await func();
    }
}