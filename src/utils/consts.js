export const LIST_OF_ADMINS = process.env.LIST_OF_ADMINS
    .split(',')
    .map(str => parseInt(str, 10))

export const MONTHS = [
    ["Январь", "january"],
    ["Февраль", "february"],
    ["Март", "march"],
    ["Апрель", "april"],
    ["Май", "may"],
    ["Июнь", "june"],
    ["Июль", "july"],
    ["Август", "august"],
    ["Сентябрь", "september"],
    ["Октябрь", "october"],
    ["Ноябрь", "november"],
    ["Декабрь", "december"]
];