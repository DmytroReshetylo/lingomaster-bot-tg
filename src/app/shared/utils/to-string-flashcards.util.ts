import { Vocabulary } from '../../services/database/vocabulary/vocabulary.entity';

export function toStringFlashcards(vocabulary: Vocabulary) {
    return vocabulary.flashcards.map(flashcard => `${flashcard.word} - ${flashcard.translate}`).join('\n');
}