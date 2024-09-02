import { EntitySubscriberInterface, EventSubscriber, InsertEvent, RemoveEvent } from 'typeorm';
import { textService } from '../entities/ai-text/text.service';
import { StudyLanguages } from '../entities/study-languages/study-language.entity';
import { vocabularyService } from '../entities/vocabulary/vocabulary.service';

@EventSubscriber()
export class StudyLanguageSubscriber implements EntitySubscriberInterface<StudyLanguages> {

    listenTo() {
        return StudyLanguages;
    }

    async afterInsert(event: InsertEvent<StudyLanguages>) {
        await vocabularyService.insert({studyLanguages: event.entity, json: []});
    }

    async beforeRemove(event: RemoveEvent<StudyLanguages>) {
        await vocabularyService.delete({studyLanguages: event.entity});
        await textService.delete({studyLanguages: event.entity});
    }

}