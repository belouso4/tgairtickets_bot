import { Composer, Markup, Scenes } from 'telegraf'
import { message } from 'telegraf/filters';
import { messages } from '../../assets/index.js';
import Flight from '../../services/aviasales/index.js';
import { getLocationBycoordinate } from '../../services/api.js';
import { startKeyboard } from '../start/keyboards.js';
import { airportKeyboard, locationKeyboard, monthsKeyboard, sendLocationKeyboard, sortTiketsByPriceKeyboard, transferKeyboard, typeRouteKeyboard } from './keyboards.js';
import { MONTHS } from '../../utils/consts.js';
import { getNextMonthYear } from './helpers.js';
import searchTikets, { getCities } from './actions.js';

const searchScene = new Scenes.BaseScene('search-scene');

const messageRegex = /^Из (.+) В (.+)$/i;
const priceRegex = /^ниже: (.+)$/i;
const monthsArray = MONTHS.map(month => month[1])

searchScene.enter(async (ctx) => {
    ctx.session.filter = {
        route: {}
    }
    await ctx.reply(messages['ru'].searchStart, { parse_mode: 'MarkdownV2', ...locationKeyboard });
});

searchScene.on(message('via_bot'), async (ctx) => {
    const regexText = ctx.message.text.match(/(to|from):\s*([^\s].*)/gi)
    const text = regexText ? regexText[0].split(':') : null
    const direction = text[0] === 'from' ? 'origin' : 'destination'

    const place = await Flight.autocomplete(text[1], ['airport'])

    await ctx.deleteMessage()
    await ctx.reply('Уточните, что именно нужно👇', airportKeyboard(place, direction))
});

searchScene.action('location', async ctx => {
    await ctx.reply('Отправить местоположение', sendLocationKeyboard)
    await ctx.answerCbQuery()
})

searchScene.on(message('location'), async (ctx) => {
    const locateMsag = await ctx.reply('Локация обробатывается...')
    await ctx.deleteMessage(ctx.message.message_id - 1)
    await ctx.deleteMessage()

    const location = await getLocationBycoordinate(ctx.message.location);
    const origin = (await Flight.autocomplete(location.city, ['city', 'country']))[0]

    const place = await Flight.autocomplete(origin.name, ['airport'])

    await ctx.deleteMessage(locateMsag.message_id)
    await ctx.reply('Уточните, что именно нужно', airportKeyboard(place, 'origin'))

})

searchScene.hears(/(to|from):\s*([^\s].*)/gi, async (ctx) => {
    await ctx.deleteMessage()
    const locateMsag = await ctx.reply('Локация обробатывается...')
    const [, type, name] = ctx.match
    const direction = type.toLowerCase() === 'from' ? 'origin' : 'destination'

    const place = await getCities(name)

    await ctx.deleteMessage(locateMsag.message_id)
    await ctx.reply('Уточните, что именно нужно', airportKeyboard(place, direction))
})

searchScene.action(/code_\s*([^\s].*)/gi, async (ctx) => {
    const [type, , code] = ctx.callbackQuery.data.split('_')
    const city = (await getCities(code))[0]
    const city_name = city.city_name || city.name

    ctx.session.filter.route[type] = {
        iata: code,
        city_name
    }

    await ctx.answerCbQuery()

    if (ctx.session.filter.route.origin && ctx.session.filter.route.destination) {
        return await ctx.reply('Выберите месяц', monthsKeyboard);
    } else if (!ctx.session.filter.route.origin) {
        return await ctx.reply(messages['ru'].searchViaOrigin, { parse_mode: 'MarkdownV2', });
    }

    return await ctx.reply(messages['ru'].searchViadestination, { parse_mode: 'MarkdownV2' });
})

searchScene.hears(messageRegex, async (ctx) => {
    const locateMsag = await ctx.reply('Локация обробатывается...')
    const query = ctx.message.text
    const replacedString = query.replace(/ /g, '%20');
    if (!query) return ctx.scene.leave();

    const route = await Flight.getRoute(replacedString)
    route.origin.city_name = (await getCities(route.origin.iata))[0].name
    route.destination.city_name = (await getCities(route.destination.iata))[0].name

    ctx.session.filter.route = route
    await ctx.deleteMessage(locateMsag.message_id)
    ctx.session.filter.fullroute = replacedString
    await ctx.reply('Выберите месяц', monthsKeyboard);
})

searchScene.action(monthsArray, async (ctx) => {
    const monthIndex = MONTHS.findIndex(month => month[1] === ctx.callbackQuery.data)
    if (monthIndex === -1) {
        ctx.reply('Ошибка');
        return
    }
    ctx.session.filter.date = getNextMonthYear(monthIndex)

    await ctx.editMessageText('Выберите тип отправления', typeRouteKeyboard);
    await ctx.answerCbQuery()
})

searchScene.action(['one way', 'roundtrip'], async ctx => {
    ctx.session.filter.one_way = ctx.callbackQuery.data === 'one way' ? true : false;
    await ctx.editMessageText('Выберите тип поиска', transferKeyboard)
})

searchScene.action(['direct', 'notdirect'], async ctx => {
    ctx.session.filter.direct = ctx.callbackQuery.data === 'direct' ? true : false;
    await ctx.editMessageText('По какой цене сортровать билеты?', sortTiketsByPriceKeyboard)
})


searchScene.action(['lowPrice', 'setLowPrice'], async (ctx) => {
    if ('lowPrice' === ctx.callbackQuery.data) {
        ctx.session.filter.sort = 'low'
        searchTikets(ctx, ctx.getUserId())
        return ctx.scene.leave();
    }

    await ctx.reply('Напишите ниже какой цены показывать билеты. ниже: цены');
    await ctx.answerCbQuery()
})

searchScene.hears(priceRegex, async (ctx) => {
    const lowPrice = ctx.message.text.split(':')[1].trim()
    ctx.session.filter.sort = lowPrice
    searchTikets(ctx, userId(ctx))
})


export default searchScene