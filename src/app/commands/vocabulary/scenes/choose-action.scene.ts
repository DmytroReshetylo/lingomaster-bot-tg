import { CreateScene } from '../../../../core';
import { TelegramContext } from '../../../../core/ctx.class';
import { CreateSelectButtonComposer } from '../../../../core/decorators/scene/composers';
import { Scene } from '../../../../core/decorators/scene/types';
import { EntityNames } from '../../../services/database/entities/entity-names';
import { CreateReplyAction } from '../../../shared/actions';
import { CreateChooseSceneAction } from '../../../shared/actions/create-choose-scene.action';

const actionButtons = [
    'VOCABULARY.SEE_FLASHCARDS.TITLE',
    'VOCABULARY.STUDY_FLASHCARDS.TITLE',
    'VOCABULARY.ADD_FLASHCARDS.TITLE',
    'VOCABULARY.CHANGE_FLASHCARD.TITLE',
    'VOCABULARY.DEL_FLASHCARDS.TITLE',
    'BUTTONS.CANCEL'
];

const actions = [
    {value: 'VOCABULARY.SEE_FLASHCARDS.TITLE', scene: 'vocabulary-see-flashcards-scene'},
    {value: 'VOCABULARY.STUDY_FLASHCARDS.TITLE', scene: 'vocabulary-study-language-scene'},
    {value: 'VOCABULARY.ADD_FLASHCARDS.TITLE', scene: 'vocabulary-add-flashcards-scene'},
    {value: 'VOCABULARY.CHANGE_FLASHCARD.TITLE', scene: 'vocabulary-change-flashcard-scene'},
    {value: 'VOCABULARY.DEL_FLASHCARDS.TITLE', scene: 'vocabulary-delete-flashcards-scene'},
]

@CreateScene('vocabulary-choose-action-scene')
export class VocabularyChooseActionScene implements Scene {
    start(ctx: TelegramContext) {
        CreateReplyAction(ctx, 'INFO.SELECT_ACTION', ctx.session[EntityNames.User].interfaceLanguage, 'button', actionButtons);
    }

    @CreateSelectButtonComposer('action', actionButtons, true)
    afterSelectAction(ctx: TelegramContext) {
        CreateChooseSceneAction(ctx, actions, ctx.scene.states.action);
    }
}