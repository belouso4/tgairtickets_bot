import Ticket from '../models/ticket.js';
import mongoose from 'mongoose';
import { limitFetch } from '../consts.js'

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

export const compareAndReplace = async (originalArray, newArray) => {
    let printArray = []

    for (const newObj of newArray) {
        const index = originalArray.findIndex(obj =>
            new Date(obj.departure_at).toString() === new Date(newObj.departure_at).toString());

        if (index !== -1) {
            // Проверяем, отличается ли новый объект от текущего объекта в исходном массиве
            if (checkChangePrice(originalArray[index].price, newObj.price)) {
                await Ticket.findByIdAndUpdate(originalArray[index]._id, newObj)
                printArray.push(newObj)
            }
        } else {
            if (newArray.length < limitFetch || checkObjLowerPrice(newArray, newObj)) {
                await Ticket.create({ _id: new mongoose.Types.ObjectId(), ...newObj })
                printArray.push(newObj)
            }
        }
    };

    return printArray
}

export function checkChangePrice(oldPrice, newPrice, percent = 15) {
    const change = oldPrice - newPrice;
    const percentChange = (change / newPrice) * 100;

    console.log(`Процентное изменение: ${percentChange.toFixed(2)}%`);
    return percentChange.toFixed(2) >= percent;
}

function checkObjLowerPrice(tikets, obj = null) {
    const priceArray = tikets.map(tiket => tiket.price)
    const priceSum = priceArray.reduce((acc, curr) => acc + curr, 0);
    const priceAverage = priceSum / priceArray.length;

    const minValue = Math.min(...priceArray);

    if (minValue === obj.price) return checkChangePrice(priceAverage, minValue);
    return false
}

export async function saveTicketsLowerPrice(tikets) {
    let data = []
    for (let i = 0; i < tikets.length; i++) {
        if (tikets.length < limitFetch || checkObjLowerPrice(tikets, tikets[i])) data.push(tikets[i]);
    }
    if (data.length) await Ticket.insertMany(data)
}

export function calcAveragePrice(tikets) {
    const priceArray = tikets.map(tiket => tiket.price)
    const priceSum = priceArray.reduce((acc, curr) => acc + curr, 0);
    const priceAverage = priceSum / priceArray.length;

    const minValue = Math.min(...priceArray);
    return checkChangePrice(priceAverage, minValue);
}
