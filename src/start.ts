import * as dotenv from 'dotenv';

const version = process.argv[2].slice(1);

dotenv.config({ path: `.env.${version}` });

import { launchProject } from './main';

launchProject();

