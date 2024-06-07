import { Scenes } from 'telegraf'

import startScene from './controllers/start/index.js';
import searchScene from './controllers/search/index.js';
import { startKeyboard } from './controllers/start/keyboards.js';
import settingsScene from './controllers/settings/index.js';



const stage = new Scenes.Stage([
    startScene,
    searchScene,
    settingsScene
]);

stage.hears('Главное меню', async (ctx) => ctx.reply('Главное меню', startKeyboard));
// stage.action('cancel', async (ctx) => ctx.reply('Главное меню', startKeyboard));

export default stage