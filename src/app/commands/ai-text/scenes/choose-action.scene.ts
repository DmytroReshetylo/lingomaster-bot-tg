import { CreateScene } from '../../../../core';
import { TelegramContext } from '../../../../core/ctx.class';
import { CreateSelectButtonComposer } from '../../../../core/decorators/scene/composers';
import { Scene } from '../../../../core/decorators/scene/types';
import { EntityNames } from '../../../services/database/entities/entity-names';
import { CreateChooseSceneAction, CreateReplyAction } from '../../../shared/actions';

const actionButtons = [
    'TEXT.SEE_TEXT.TITLE',
    'TEXT.STUDY.TITLE',
    'TEXT.ADD_TEXT.TITLE',
    'TEXT.DEL_TEXT.TITLE',
    'BUTTONS.CANCEL'
];

const actions = [
    {value: 'TEXT.SEE_TEXT.TITLE', scene: 'text-see-scene'},
    {value: 'TEXT.STUDY.TITLE', scene: 'text-study-scene'},
    {value: 'TEXT.ADD_TEXT.TITLE', scene: 'text-add-scene'},
    {value: 'TEXT.DEL_TEXT.TITLE', scene: 'text-delete-scene'},
]

@CreateScene('text-choose-action-scene')
export class TextChooseActionScene implements Scene {
    start(ctx: TelegramContext) {
        CreateReplyAction(ctx, 'INFO.SELECT_ACTION', ctx.session[EntityNames.User].interfaceLanguage, 'button', actionButtons);
    }

    @CreateSelectButtonComposer('action', actionButtons, true)
    afterSelectAction(ctx: TelegramContext) {
        CreateChooseSceneAction(ctx, actions, ctx.scene.states.action);
    }
}