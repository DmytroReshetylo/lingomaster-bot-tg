import { Context, Scenes } from 'telegraf';
import { User } from '../../app/services/database/user/user.entity';
import { Vocabulary } from '../../app/services/database/vocabulary/vocabulary.entity';

export type Ctx = any & Context & Scenes.SceneContextScene<any> & Scenes.WizardContextWizard<any> & {
    scene: {
        leave: () => void,
        enter: (sceneName: string) => void
    },
    wizard: {
        next: () => void,
        state: {
            [s: string]: any
        }
    }
    session: {
        idTelegram: string,
        user: User,
        vocabularies: Vocabulary[]
        [s: string]: any
    }
};