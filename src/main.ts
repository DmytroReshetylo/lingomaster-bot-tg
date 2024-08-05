import * as path from 'path';
import { connectToDB } from './app/services/database';
import { photoManagerService } from './app/services/photo-manager/photo-manager.service';
import { languageDetectorService } from './app/services/language-detector';
import { languageConfig, startBotConfig } from './configs';
import { start } from './core';
import { runSequentially } from './core/run-sequentially.alghoritm';
import { registerLanguages } from './core/language-interface/translate.alghoritm';
import * as fs from 'fs';

require('dotenv').config();

runSequentially(
    registerLanguages.bind(null, languageConfig),
    languageDetectorService.connect.bind(languageDetectorService),
    connectToDB,
    start.bind(null, startBotConfig),
    () => setInterval(() => {
        photoManagerService.generatePhotoDescriptorsForAll();
        fs.rm(path.join(__dirname, '.out'), { recursive: true, force: true }, () => {});
    }, 1000 * 60 * 10),
);