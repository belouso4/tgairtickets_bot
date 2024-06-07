import { limitFetch } from "../../consts.js";
import Ticket from "../../models/ticket.js";

export const getNextMonthYear = (selectedMonthIndex) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    if (selectedMonthIndex < currentMonth) {
        return `${currentYear + 1}-${(selectedMonthIndex + 1 < 10 ? '0' : '')}${selectedMonthIndex + 1}`;
    } else {
        return `${currentYear}-${(selectedMonthIndex + 1 < 10 ? '0' : '')}${selectedMonthIndex + 1}`;
    }
}

export async function saveTicketsLowerPrice(tikets) {
    let data = []
    for (let i = 0; i < tikets.length; i++) {
        if (tikets.length < limitFetch || checkObjLowerPrice(tikets, tikets[i])) data.push(tikets[i]);
    }
    if (data.length) await Ticket.insertMany(data)
}

function checkObjLowerPrice(tikets, obj = null) {
    const priceArray = tikets.map(tiket => tiket.price)
    const priceSum = priceArray.reduce((acc, curr) => acc + curr, 0);
    const priceAverage = priceSum / priceArray.length;

    const minValue = Math.min(...priceArray);

    if (minValue === obj.price) return checkChangePrice(priceAverage, minValue);
    return false
}

export function checkChangePrice(oldPrice, newPrice, percent = 15) {
    const change = oldPrice - newPrice;
    const percentChange = (change / newPrice) * 100;

    console.log(`Процентное изменение: ${percentChange.toFixed(2)}%`);
    return percentChange.toFixed(2) >= percent;
}

// check whether the user created the same filter
export const compareUserFields = (directions, { origin, destination, date, lower_price, one_way }) => {
    return new Promise((resolve, reject) => {
        for (const direction of directions) {
            if (origin === direction.origin
                && destination === direction.destination
                && date === direction.date
                && one_way === direction.one_way
                && (lower_price === undefined || lower_price === direction.lower_price)) {

                return resolve(true)
            }
        }
        return resolve(false)
    });

}

export const chechRoute = async (ctx, route) => {
    if (!Object.keys(route).length) {
        await ctx.reply(`Маршрут не найден`)
        ctx.answerCbQuery()
        return true
    }
}

export const getCityName = (data, param) => {
    // console.log(data, param);
    return (data.find(el => el.code === param)).name
}