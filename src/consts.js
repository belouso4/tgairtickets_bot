export const limitFetch = 3
export const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short'
}
export const LIST_OF_ADMINS = process.env.LIST_OF_ADMINS
    .split(',')
    .map(str => parseInt(str, 10))
export const userId = (ctx) => ctx.update.callback_query?.from?.id || ctx.from.id;
