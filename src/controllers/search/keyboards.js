import { Markup } from "telegraf"
import { MONTHS } from "../../utils/consts.js"

export const airportKeyboard = (place, direction) => Markup.inlineKeyboard(place.reduce((acc, key, index) => {
    acc.push([Markup.button.callback(`${key.name} (${key.code})`, direction + '_code_' + key.code)])
    return acc
}, []))

export const locationKeyboard = Markup.inlineKeyboard([
    Markup.button.callback('Отправить местоположение', 'location')
]).resize()


export const sendLocationKeyboard = Markup.keyboard([
    Markup.button.locationRequest('Send location'),
    Markup.button.callback('Главное меню')
]).resize()

export const monthsKeyboard = Markup.inlineKeyboard(MONTHS
    .map((el, key) => Markup.button.callback(el[0], el[1]))
    .reduce((acc, curr, index) => {
        const rowIndex = Math.floor(index / 3);
        if (!acc[rowIndex]) {
            acc[rowIndex] = [];
        }
        acc[rowIndex].push(curr);

        return acc;
    }, [])
)

export const typeRouteKeyboard =
    Markup.inlineKeyboard([
        Markup.button.callback('В одну сторону', 'one way'),
        Markup.button.callback('Туда и обратно', 'roundtrip')
    ])

export const transferKeyboard =
    Markup.inlineKeyboard([
        Markup.button.callback('Без пересадок', 'direct'),
        Markup.button.callback('С пересадками', 'notdirect')
    ])

export const sortTiketsByPriceKeyboard =
    Markup.inlineKeyboard([
        Markup.button.callback('Самые дешевые', 'lowPrice'),
        Markup.button.callback('Ниже определенной цены', 'setLowPrice')
    ])