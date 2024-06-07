import 'dotenv/config'
import { start as startBot } from './src/bot.js';
import MDBConnect from './mongodb.js';

(async function () {
    try {
        await MDBConnect()
        await startBot();
    } catch (error) {
        console.error('Failed to setup the bot:', error);
    }
}());