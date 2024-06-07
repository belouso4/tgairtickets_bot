export default {
    searchStart: escapeSpecialChars('Пожалуйста, укажите страну или город отправления и назначения в следующем формате:\n\n' +
        '`Из Москвы в Лондон`\n\n' +
        'Вы также можете воспользоваться поиском, написав:\n\n' +
        '`@TaskWiseHelperBot from/to:` {нужное значение}\n\n' +
        'Если вам нужно установить текущее местоположение, воспользуйтесь кнопкой "*Отправить местоположение*".'),

    searchViaOrigin: escapeSpecialChars('Напишите\n\n `from: {нужное значение}`\n\nили можете воспользоваться поиском, написав:\n\n' +
        '`@TaskWiseHelperBot from:` {нужное значение}'),

    searchViadestination: escapeSpecialChars('Напишите\n\n `to: {нужное значение}`\n\nили можете воспользоваться поиском, написав:\n\n' +
        '`@TaskWiseHelperBot to:` {нужное значение}'),
}

function escapeSpecialChars(input) {
    return input
        .replace(/\./g, '\\.')
        .replace(/\{/g, '\\{')
        .replace(/\}/g, '\\}');
}

