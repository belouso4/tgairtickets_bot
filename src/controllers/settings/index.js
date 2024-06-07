import { Markup, Scenes } from 'telegraf'
import User from '../../models/user.js';
import { printTickets } from '../../utils/printText.js';
import Flight from '../../services/aviasales/index.js';
import { limitFetch } from '../../consts.js';

const settingsScene = new Scenes.BaseScene('settings-scene');

const deleteIdRegex = /^delete:(.+)$/i;
const showFlightsRegex = /^showFlights:(.+)$/i;

settingsScene.enter(async (ctx) => {

    const user = await User.findOne({ user_id: ctx.getUserId() })
    let text = ''

    if (!user?.to_watch?.length) {
        return await ctx.reply('Нет выбранных направлений.')
    }

    await ctx.reply('Отслеживаемые направления 👇:')
    user.to_watch.forEach(async (way, key) => {
        let text = ''
        text += `📍 ${way.origin_city_name} - ${way.destination_city_name}`
        text += way.one_way ? `\n➡️ в одну сторону` : `\n↔️ туда и обратно`
        text += way.direct ? `\n➡️ прямой рейс` : '\n↕️ с пересадками'
        text += "\n🕛 Отслеживать за период: " + way.date
        text += way.lower_price ? "\n🔔 Уведомлять при цене: 🔻" + way.lower_price : "\n🔔 Уведомлять при низкой цене"

        await ctx.reply(text, Markup.inlineKeyboard([
            Markup.button.callback('Показать белеты', 'showFlights:' + key),
            Markup.button.callback('❌ Удалить', 'delete:' + way._id),
        ]))
    })
});

settingsScene.action(showFlightsRegex, async (ctx) => {
    const id = ctx.callbackQuery.data.split(':')[1]
    const user = await User.findOne({ user_id: ctx.getUserId() })
    let params = user.to_watch[id]
    params.limit = limitFetch

    const tikets = await Flight.pricesForDates(params)

    await ctx.reply(
        await printTickets(tikets, params),
        { parse_mode: 'Markdown', disable_web_page_preview: true }
    )

    await ctx.answerCbQuery()
})

settingsScene.action(deleteIdRegex, async (ctx) => {
    const id = ctx.callbackQuery.data.split(':')[1]
    const user = await User.findOne({ user_id: ctx.getUserId() })

    try {
        await user.to_watch.id(id).deleteOne()
        await user.save()

        await ctx.deleteMessage()
    } catch (error) { }
})

export default settingsScene
