import { TelegramContext } from '../../../core/ctx.class';

export function CreateChooseSceneAction(ctx: TelegramContext, data: {value: string, scene: string}[], value: string) {
    data.forEach(data => {
        if(value === data.value) {
            ctx.scene.enterScene(data.scene);
        }
    })
}