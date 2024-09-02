import { TelegramContext } from '../../../../../../core/ctx.class';
import { AIText } from '../../../../../services/database/entities/ai-text/text.entity';
import { EntityNames } from '../../../../../services/database/entities/entity-names';
import { CreateButtonsWithStepsAction } from '../../../../../shared/actions/create-show-buttons-with-steps.action';
import { QueueOnDelete } from '../../../../../shared/classes';

export function ListTextsWithStepsPartAction(ctx: TelegramContext, texts: AIText[], queueOnDelete: QueueOnDelete, value?: 'BUTTONS.NEXT' | 'BUTTONS.BACK' | number, callback?: Function) {
    CreateButtonsWithStepsAction(
        ctx,
        'TEXT.ASK.SELECT_TEXT',
        ctx.session[EntityNames.User].interfaceLanguage,
        texts,
        'associativeName',
        queueOnDelete,
        value,
        callback
    );
}