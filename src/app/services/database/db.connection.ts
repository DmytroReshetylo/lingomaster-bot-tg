import { DataSource } from 'typeorm';
import { AIText } from './entities/ai-text/text.entity';
import { StudyLanguages } from './entities/study-languages/study-language.entity';
import { User } from './entities/user/user.entity';
import { Vocabulary } from './entities/vocabulary/vocabulary.entity';
import { StudyLanguageSubscriber } from './events/study-language.event';
import { InitializeServices } from './initialize-services';

//@ts-ignore
export const dbConnection = new DataSource({
    type: 'postgres',
    url: (process.env.db as string),
    entities: [User, StudyLanguages, Vocabulary, AIText],
    subscribers: [StudyLanguageSubscriber],
    synchronize: true,
    ssl: {
        rejectUnauthorized: false
    }
})

export async function connectToDB() {
    try {
        await dbConnection.initialize();

        InitializeServices();

        console.log('Database was connected!');
    }catch (err:any) {
        console.log(err);
    }

}


