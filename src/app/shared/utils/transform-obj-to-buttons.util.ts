export function transformOBJToButton<
    T extends {id: number, [p: string]: any},
    KEY extends keyof T
>(buttons: T[], displayKey: KEY) {
    return buttons.map(button => ({text: button[displayKey], data: button.id}));
}