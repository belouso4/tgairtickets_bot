import { limitFetch } from "../../consts.js";
import User from "../../models/user.js";
import Flight from "../../services/aviasales/index.js";
import { printTickets } from "../../utils/printText.js";
import { chechRoute, compareUserFields, saveTicketsLowerPrice } from "./helpers.js";

export default async function searchTikets(ctx, user_id) {
    let user = await User.findOne({ user_id });
    const dataFilter = ctx.session.filter
    const route = dataFilter.route

    if (await chechRoute(ctx, route)) return await ctx.scene.leave()
    const filter = {
        origin: route.origin.iata,
        destination: route.destination.iata,
        limit: limitFetch,
        origin_city_name: route.origin.city_name,
        destination_city_name: route.destination.city_name,
        ...dataFilter,
        lower_price: dataFilter?.lowPrice
    }

    if (await compareUserFields(user.to_watch, filter)) {
        await ctx.answerCbQuery()
        return await ctx.reply('Такой маршрут уже есть.')
    }
    await user.to_watch.push({ ...filter });
    await user.save();

    let tikets = await Flight.pricesForDates(filter)

    if (!tikets) await ctx.reply('По данному направлению ничего не найдено.')

    if (dataFilter?.lowPrice) {
        for (let i = tikets.length - 1; i >= 0; i--) {
            if (tikets[i].price > +dataFilter?.lowPrice) {
                tikets.splice(i, 1);
            }
        }
    }

    await saveTicketsLowerPrice(tikets)

    await ctx.reply('✅ Направление добавлено, а вот самые низкие цены на сегодня👇👇👇')
    await ctx.reply(
        await printTickets(tikets, filter, 'Нет билетов ниже указанной цены, но направление сохранено.'),
        { parse_mode: 'Markdown', disable_web_page_preview: true }
    )

    if (!dataFilter?.lowPrice) {
        await ctx.answerCbQuery()
    }

    ctx.session.filter = {}
}

export const getCities = async (name) => {
    const place = await Flight.autocomplete(name, ['city', 'airport'])

    if (!place) return undefined
    const country_code = place[0].country_code

    const cities = place.filter(c => c.country_code === country_code)

    return cities
}
