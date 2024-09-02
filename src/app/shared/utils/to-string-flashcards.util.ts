import { Vocabulary } from '../../services/database/entities/vocabulary/vocabulary.entity';

export function toStringFlashcards(vocabulary: Vocabulary) {
    return vocabulary.json.map(flashcard => `${flashcard.word} - ${flashcard.translate}`).join('\n');
}