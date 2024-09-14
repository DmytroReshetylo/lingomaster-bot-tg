import { CtxSession } from '../types/ctx-session.type';

export abstract class DataInCtxManaging {
    protected ctx: any;

    constructor(ctx: any) {
        this.ctx = ctx;
    }

    protected currentNameComposer() {
        return (this.ctx.session as CtxSession).sceneComposers[(this.ctx.session as CtxSession).indexCurrentComposer];
    }

    protected setDefaultValuesBeforeEnterScene() {
        const globalSession = (this.ctx.session as CtxSession).session || {};

        this.ctx.session = {
            temp: {},
            session: globalSession,
            sceneComposers: [],
            indexCurrentComposer: -1
        }
    }

    protected goToNextComposer() {
        (this.ctx.session as CtxSession).indexCurrentComposer++;

        this.ctx.scene.enter(this.currentNameComposer());
    }

    protected goToBackComposer() {
        (this.ctx.session as CtxSession).indexCurrentComposer--;

        this.ctx.scene.next(this.currentNameComposer());
    }

    protected leaveScene() {
        this.setDefaultValuesBeforeEnterScene();

        this.ctx.scene.leave();
    }

}