import { createModifyParam } from '../../../core/telegram-utils';
import { StudyLanguageManaging } from '../classes';

export const GetStudyLanguageManaging = createModifyParam(ctx => {
    if(!ctx.scene.states.StudyLanguageManaging) {
        ctx.scene.states.StudyLanguageManaging = new StudyLanguageManaging(ctx);
    }

    return ctx.scene.states.StudyLanguageManaging;
});