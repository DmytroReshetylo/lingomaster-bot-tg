export function TransformAsKeyFormat(prefix: string, items: string[]) {
    return items.map(item => `${prefix.toUpperCase()}.${item.toUpperCase()}`);
}