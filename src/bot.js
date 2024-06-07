import 'dotenv/config'
import { Telegraf, session, Markup, Scenes } from 'telegraf'
import express from 'express';

import { scheduleAir } from './schedul.js'

import stage from './stage.js';
import { adminMiddleware } from './middleware.js';
import { startKeyboard } from './controllers/start/keyboards.js';
import searchCommands from './controllers/search/commands.js';

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.listen(PORT, (err) => {
	err ? console.log(err) : console.log(`listening port ${PORT}`);
});

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.use(session());
app.use(bot.webhookCallback('/secret-path'));
bot.use(stage.middleware());

/* -------------------------- bot events --------------------------- */

bot.context.getUserId = function () {
	return this.update.callback_query?.from?.id || this.from.id
}

bot.command('start', async (ctx) => ctx.scene.enter('start-scene'))
bot.command('menu', async (ctx) => ctx.reply('Главное меню', startKeyboard))

bot.use(adminMiddleware)

searchCommands(bot)
bot.hears('🔍 Поиск', async (ctx) => await ctx.scene.enter('search-scene'))
bot.hears('✈️ Направления', async (ctx) => await ctx.scene.enter('settings-scene'))

scheduleAir(bot)

export async function start() {
	await bot.telegram.setMyCommands([
		// { command: 'start', description: 'open the menu' },
		{ command: 'menu', description: 'open the menu' },
	]);

	await bot.launch();
	console.log(new Date(), 'Bot started as', bot.botInfo?.username);
}