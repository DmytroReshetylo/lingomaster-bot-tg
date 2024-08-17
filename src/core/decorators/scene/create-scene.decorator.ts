import { Scenes } from 'telegraf';
import { TelegramContext } from '../../ctx.class';
import { Ctx } from '../../types';

export const listScenes: Function[] = [];

export function CreateScene(sceneName: string) {
    return function (target: any) {
        const composers = Object.getOwnPropertyNames(target.prototype)
            .filter((composer) => composer !== 'constructor');

        if(!composers.length) {
            throw Error('The class has no composers');
        }

        if(composers[0] !== 'start') {
            throw Error('Method start isn\'t exist or must be the first in the class');
        }

        const startComposer = Object.getOwnPropertyDescriptor(target.prototype, composers[0]!)!.value;

        Object.defineProperty(
            target.prototype,
            composers[0]!,
            {
                value: () => {
                    return (ctx: Ctx) => {
                        const tgCtx = new TelegramContext(ctx);

                        startComposer(tgCtx);
                    }
                }
            }
        )

        listScenes.push(() => {
            return new Scenes.WizardScene<any>(
                sceneName,
                ...composers.map(composer => Object.getOwnPropertyDescriptor(target.prototype, composer!)!.value())
            )
        })

        return target;
    }
}

export function registerScenes() {
    return listScenes.map((command) => command());
}