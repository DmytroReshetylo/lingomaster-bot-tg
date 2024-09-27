import { DataSource } from 'typeorm';
import { FlashcardEntity } from '../database/entities/flashcard.entity';
import { LearningLanguageEntity } from '../database/entities/learning-language.entity';
import { UserEntity } from '../database/entities/user.entity';
import { VocabularyEntity } from '../database/entities/vocabulary.entity';
import { EntityNames } from '../enums/entity-names.enum';

export class DbConnectionProvider {
    private dbConnection: DataSource;

    constructor() {
        //@ts-ignore
        this.dbConnection = new DataSource({
            type: 'postgres',
            url: (process.env.db as string),
            entities: [UserEntity, LearningLanguageEntity, VocabularyEntity, FlashcardEntity],
            synchronize: true,
            ssl: {
                rejectUnauthorized: false
            }
        })

        try {
            this.dbConnection.initialize().then(() => console.log('DB CONNECTED'));
        }catch (err:any) {
            console.log(err);
        }
    }

    getRepository(entityName: EntityNames) {
        return this.dbConnection.getRepository(entityName);
    }
}