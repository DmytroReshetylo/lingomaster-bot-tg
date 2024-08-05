import { Languages } from './enums';
import * as fs from 'fs';

const languagesJSON: {[s: string]: {[s: string]: string} | null} = {};

export function registerLanguages(languages: {language: Languages, path: string}[]) {
    for(const {language, path} of languages) {
        fs.readFile(path, 'utf-8', (err, data) => {
            languagesJSON[language] = JSON.parse(data);
        });
    }
}

export function translate(s: string, language: string | null): string {
    if(!language) {
        language = Languages.en;
    }

    let json:any = languagesJSON[language];

    const pathToTranslation = s.split('.');

    for(const i of pathToTranslation ) {
        json = json[i];

        if(!json) {
            return s;
        }
    }

    return json as string;
}

export function translateArray(arr: string[], language: string | null) {
    return arr.map((s) => translate(s, language));
}

export function findInJson(s: string, language: Languages) {
    let json:any = languagesJSON[language];
    let finded: boolean = false;

    function find(currentPosition: string, s:string, json: any) {
        if(finded) {
            return;
        }

        for(const fragment in json) {
            if(json[fragment] === s) {
                finded = true;

                return currentPosition.length ? `${currentPosition}.${fragment}` : fragment;
            }

            if(String(fragment).length <= 1) {
                break;
            }

            const nextPosition = currentPosition.length ? `${currentPosition}.${fragment}` : fragment;

            const result = find(nextPosition, s, json[fragment]) as string | null;

            if(result !== s) {
                return result;
            }
        }

        return s;
    }

    return find('', s, json) as string;
}