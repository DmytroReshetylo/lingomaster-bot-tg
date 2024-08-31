import { CreateScene } from '../../../../core';
import { TelegramContext } from '../../../../core/ctx.class';
import { CreateSelectButtonComposer } from '../../../../core/decorators/scene/composers';
import { Scene } from '../../../../core/decorators/scene/types';
import { EntityNames } from '../../../services/database/entities/entity-names';
import { CreateReplyAction } from '../../../shared/actions';
import { CreateChooseSceneAction } from '../../../shared/actions/create-choose-scene.action';

const actionButtons = [
    'text.SEE_text.TITLE',
    'text.STUDY.TITLE',
    'text.ADD_text.TITLE',
    'text.DEL_text.TITLE',
    'BUTTONS.CANCEL'
];

const actions = [
    {value: 'text.SEE_text.TITLE', scene: 'text-see-scene'},
    {value: 'text.STUDY.TITLE', scene: 'text-study-scene'},
    {value: 'text.ADD_text.TITLE', scene: 'text-add-scene'},
    {value: 'text.DEL_text.TITLE', scene: 'text-delete-scene'},
]

@CreateScene('text-choose-action-scene')
export class VocabularyChooseActionScene implements Scene {
    start(ctx: TelegramContext) {
        CreateReplyAction(ctx, 'INFO.SELECT_ACTION', ctx.session[EntityNames.User].interfaceLanguage, 'button', actionButtons);
    }

    @CreateSelectButtonComposer('action', actionButtons, true)
    afterSelectAction(ctx: TelegramContext) {
        CreateChooseSceneAction(ctx, actions, ctx.scene.states.action);
    }
}