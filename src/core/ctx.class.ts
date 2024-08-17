import { MessageInfo, SceneManaging } from './types';

export class TelegramContext {
    #ctx: any;

    constructor(ctx: any) {
        this.#ctx = ctx;
    }

    async reply(s: string, buttons?: any): Promise<MessageInfo> {
        if(buttons) {
            return await this.#ctx.reply(s, buttons);
        }

        return await this.#ctx.reply(s);
    }


    async sendPhoto(url: string, caption?: string, buttons?: any): Promise<MessageInfo> {
        if(buttons) {
            return await this.#ctx.sendPhoto(url, {caption: caption || '', ...buttons as any});
        }

        return await this.#ctx.sendPhoto(url, {caption: caption || '', ...buttons as any});
    }

    deleteMessage(idMessage: number) {
        this.#ctx.deleteMessages(idMessage);
    }

    get message(): MessageInfo {
        if(this.#ctx.update.message) {
            return this.#ctx.update.message;
        }

        return this.#ctx.update.callback_query;
    }

    get session(): {[p: string]: any} {
        return this.#ctx.session;
    }

    get scene(): SceneManaging {
        return {
            nextAction: (): void => this.#ctx.wizard.next(),
            backAction: (): void => this.#ctx.wizard.back(),
            leaveScene: (): void => this.#ctx.scene.leave(),
            enterScene: (nameScene: string): void => this.#ctx.scene.enter(nameScene),
            states: this.#ctx.wizard ? this.#ctx.wizard.state : {}
        }
    }

    get data(): string {
        if(this.#ctx.update.message) {
            return this.#ctx.update.message.data;
        }

        return this.#ctx.update.callback_query.data;
    }
}