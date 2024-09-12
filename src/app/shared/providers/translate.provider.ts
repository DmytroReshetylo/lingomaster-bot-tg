import { injectable } from 'inversify';
import { Languages } from '../../../framework/enums/languages.enum';

@injectable()
export class TranslateProvider {
    private static languagesJSON = new Map<Languages, any>();

    static forRoot(languages: Languages[]) {
        for(const language of languages) {
            import('../../languages/' + language.toLowerCase() + '.json').then(json => {
                this.languagesJSON.set(language, json);
            });
        }

        return TranslateProvider;
    }


    private translate(key: string, language: Languages): string {
        let json = TranslateProvider.languagesJSON.get(language);

        if(!json) {
            return key;
        }

        const pathToTranslation = key.split('.');

        for(const i of pathToTranslation ) {
            json = json[i];

            if(!json) {
                return key;
            }
        }

        return json as string;
    }

    findKey(s: string, language: Languages) {
        let json = TranslateProvider.languagesJSON.get(language);

        if(!json) {
            return s;
        }

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
}