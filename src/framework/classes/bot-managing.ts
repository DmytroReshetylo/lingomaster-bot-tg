import { WizardScene } from 'telegraf/scenes';
import { Constructor } from '../types/contructor.type';

class BotManaging {
    private nameScenes = new Map<Constructor<any>, { name: string, nameComposers: string[] }>();

    private stages: WizardScene<any>[] = [];

    registerScene(scene: Constructor<any>, name: string, nameComposers: string[]) {
        this.nameScenes.set(scene, { name, nameComposers });
    }

    getNameScene(scene: any) {
        return this.nameScenes.get(scene);
    }

    pushStage(wizard: WizardScene<any>) {
        this.stages.push(wizard);
    }

    getStages() {
        return this.stages;
    }
}

export const botManaging = new BotManaging();