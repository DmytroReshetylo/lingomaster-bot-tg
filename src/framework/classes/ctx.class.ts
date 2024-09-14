import { CtxSession } from '../types/ctx-session.type';
import { MessageInfo } from '../types/message-info.type';
import { SceneManaging } from '../types/scene-managing.type';
import { botManaging } from './bot-managing.class';
import { DataInCtxManaging } from './data-in-ctx-managing.class';

export class TelegramContext extends DataInCtxManaging {

    constructor(ctx: any) {
        super(ctx);

        if(!(this.ctx.session as CtxSession).session) {
            this.setDefaultValuesBeforeEnterScene();
        }
    }

    async reply(s: string, buttons?: any): Promise<MessageInfo> {
        if(buttons) {
            return await this.ctx.reply(s, {parse_mode: 'HTML', ...buttons});
        }

        return await this.ctx.reply(s, {parse_mode: 'HTML'});
    }

    async sendPhoto(url: string, caption = '', buttons?: any): Promise<MessageInfo> {
        return await this.ctx.sendPhoto(url, {caption: caption, parse_mode: 'HTML', ...buttons || []});
    }

    deleteMessage(idMessage: number) {
        this.ctx.deleteMessage(idMessage);
    }

    get message(): MessageInfo {
        if(this.ctx.update.message) {
            return this.ctx.update.message;
        }

        return this.ctx.update.callback_query;
    }

    get session() {
        return (this.ctx.session as CtxSession).session;
    }
    
    get scene(): SceneManaging {
        return {
            nextComposer: (): void => {
                if((this.ctx.session as CtxSession).indexCurrentComposer === -1) {
                    return;
                }

                if((this.ctx.session as CtxSession).sceneComposers.length - 1 === (this.ctx.session as CtxSession).indexCurrentComposer) {
                    return this.leaveScene();
                }

                this.goToNextComposer();
            },
            backComposer: (): void => {
                if((this.ctx.session as CtxSession).indexCurrentComposer === -1) {
                    return;
                }

                if((this.ctx.session as CtxSession).indexCurrentComposer === 0) {
                    return this.leaveScene();
                }

                this.goToBackComposer();
            },
            leaveScene: (): void => {
                if((this.ctx.session as CtxSession).indexCurrentComposer === -1) {
                    return;
                }

                this.leaveScene();
            },
            enterScene: (nameScene: string): void => {
                const sceneComposers = (this.ctx.session as CtxSession).sceneComposers;

                (this.ctx.session as CtxSession).sceneComposers = [
                    ...sceneComposers.slice(0, (this.ctx.session as CtxSession).indexCurrentComposer),
                    ...botManaging.getNameComposers(nameScene)
                ];

                this.goToNextComposer();
            },
            states: (this.ctx.session as CtxSession).temp
        }
    }

    get data(): string {
        if(this.ctx.update.message) {
            return this.ctx.update.message.text;
        }

        return this.ctx.update.callback_query.data;
    }

}