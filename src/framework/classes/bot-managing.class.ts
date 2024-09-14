import { WizardScene } from 'telegraf/scenes';

class BotManagingClass {
    private nameScenes = new Map<string, string[]>();

    private wizards: WizardScene<any>[] = [];

    registerScene(name: string, nameComposers: string[]) {
        if(this.nameScenes.has(name)) {
            throw Error(`Scene which is called ${name} already exists`);
        }

        this.nameScenes.set(name, nameComposers);
    }

    getNameComposers(nameScene: string) {
        const nameComposers = this.nameScenes.get(nameScene);

        if(!nameComposers) {
            throw Error(`Scene which is called ${name} doesn't exist`);
        }

        return nameComposers;
    }

    pushWizard(wizard: WizardScene<any>) {
        this.wizards.push(wizard);
    }

    getWizards() {
        return this.wizards;
    }
}

export const botManaging = new BotManagingClass();