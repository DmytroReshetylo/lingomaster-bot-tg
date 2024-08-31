import * as dotenv from 'dotenv';
import { launchProject } from './main';

const version = process.argv[2].slice(1);

dotenv.config({ path: `.env.${version}` });

launchProject();

