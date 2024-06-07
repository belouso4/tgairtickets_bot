import schedule from 'node-schedule';

import { limitFetch } from './consts.js';
import { printTickets } from './utils/printText.js';

import User from './models/user.js';
import Flight from './services/aviasales/index.js';
import Ticket from './models/ticket.js';
import { calcAveragePrice, compareAndReplace } from './utils/helpers.js';

export const scheduleAir = (bot) => {

  const scheduledTask = schedule.scheduleJob('*/1 * * * *', async () => {
    console.log('Task executed every minute:', new Date().toLocaleTimeString());

    parseProcessingTickets(bot)
    deleteOldTickets()
  });
}

const deleteOldTickets = async () => {
  const currentDate = new Date();

  try {
    const result = await Ticket.deleteMany({ departure_at: { $lt: currentDate } })
    console.log(`${result.deletedCount} записей удалено`);
  } catch (error) {
    console.error('Ошибка удаления записей:', error)
  }
}

const parseProcessingTickets = async (bot) => {
  const users = await User.find()
  let ticketsOld
  let tiketsNew

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const to_watch = user.to_watch;

    for (let j = 0; j < to_watch.length; j++) {
      ticketsOld = await Ticket.find({
        origin: to_watch[j].origin,
        destination: to_watch[j].destination
      })

      tiketsNew = await Flight.pricesForDates({
        limit: limitFetch,
        ...to_watch[j]._doc
      })

      // Filters tickets at low prices. Leaves in the array objects below the specified price
      if (to_watch[j].lower_price) {
        for (let i = tiketsNew.length - 1; i >= 0; i--) {
          if (tiketsNew[i].price > +to_watch[j].lower_price) {
            tiketsNew.splice(i, 1);
          }
        }
      }

      if (tiketsNew.length < limitFetch || calcAveragePrice(tiketsNew)) {
        const filteredTikets = await compareAndReplace(ticketsOld, tiketsNew);

        if (filteredTikets.length) {
          await bot.telegram.sendMessage(
            user.user_id,
            await printTickets(tiketsNew, to_watch[j]),
            { parse_mode: 'Markdown', disable_web_page_preview: true }
          );
        }

      }
    }
  }
}