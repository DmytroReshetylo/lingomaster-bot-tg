import { DataSource } from 'typeorm';
import { User } from './user/user.entity';
import { Vocabulary } from './vocabulary/vocabulary.entity';

//@ts-ignore
export const dbConnection = new DataSource({
    type: 'postgres',
    url: (process.env.db as string),
    entities: [User, Vocabulary],
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


