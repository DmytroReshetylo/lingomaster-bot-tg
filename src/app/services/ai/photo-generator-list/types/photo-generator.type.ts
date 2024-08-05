export type PhotoGenerator = {
    generate: (word: string) => Promise<string | null>;
}