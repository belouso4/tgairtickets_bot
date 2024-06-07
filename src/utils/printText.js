import City from '../models/city.js';

import moment from 'moment-timezone';

export const printTickets = async (tikets, params, msg = '') => {
  let text = `*${params.origin_city_name} - ${params.destination_city_name} | текущие цены*`
  text += params.one_way ? `\n➡️ в одну сторону` : `\n↔️ туда и обратно`
  text += params.direct ? `\n➡️ прямой рейс` : '\n↕️ с пересадками'
  if (tikets.length) {
    text += `\n`
    for (const tiket of tikets) {
      const { departure, arrival, departureBack, arrivalBack } = await convertDateFormatByTimeZone(tiket);

      text += `\n${tiket.origin_airport} 🛫 ${tiket.destination_airport}`
      text += `\n🛫 ${departure}`
      text += `\n🛬 ${arrival}`

      if (!params.one_way) {
        text += `\n\n${tiket.destination_airport} 🛫 ${tiket.origin_airport}`
        text += `\n🛫 ${departureBack}`
        text += `\n🛬 ${arrivalBack}`
      }
      text += `\n\nАвиакомпания: ${tiket.airline}`
      text += `\n💳 ${tiket.price} ₽ | [купить билет](https://www.aviasales.ru${tiket.link}&marker=531476)`
      text += `\n------------------------------------`
    }
  } else {
    text += msg ? '\n\n' + msg : ''
  }

  return text
}

/* ---------------- logic ------------------ */

function convertMinutesToHoursAndMinutes(minutes) {
  var hours = Math.floor(minutes / 60); // Получаем количество часов
  var remainingMinutes = minutes % 60; // Получаем количество оставшихся минут
  return hours + " часов " + remainingMinutes + " минут";
}

async function convertDateFormatByTimeZone(tiket) {
  const cities = await City.find({ code: { $in: [tiket.origin, tiket.destination] } });
  const cityObject = cities.reduce((acc, city) => {
    acc[city.code] = city;
    return acc;
  }, {});

  const {
    [tiket.origin]: originData,
    [tiket.destination]: destinationData
  } = cityObject;

  const dateDeparture = moment(tiket.departure_at);
  const dateDepartureBack = moment(tiket.return_at);

  const departure = dateDeparture.tz(originData.time_zone).format('D MMMM YYYY [г. в] HH:mm');
  const arrival = dateDeparture.tz(destinationData.time_zone).add(tiket.duration_to, 'minutes').format('D MMMM YYYY [г. в] HH:mm');

  const departureBack = dateDepartureBack.tz(destinationData.time_zone).format('D MMMM YYYY [г. в] HH:mm');
  const arrivalBack = dateDepartureBack.tz(originData.time_zone).add(tiket.duration_back, 'minutes').format('D MMMM YYYY [г. в] HH:mm');

  return {
    departure,
    arrival,
    departureBack,
    arrivalBack
  }
}

