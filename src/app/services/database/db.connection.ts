import { DataSource } from 'typeorm';
import { Story } from './entities/story/story.entity';
import { User } from './entities/user/user.entity';
import { Vocabulary } from './entities/vocabulary/vocabulary.entity';

//@ts-ignore
export const dbConnection = new DataSource({
    type: 'postgres',
    url: (process.env.db as string),
    entities: [User, Vocabulary, Story],
    synchronize: true,
    ssl: {
        rejectUnauthorized: false
    }
})

export async function connectToDB() {
    try {
        await dbConnection.initialize();

        console.log('Database was connected!');
    }catch (err:any) {
        console.log(err);
    }

}


