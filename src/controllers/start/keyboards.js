import { Markup } from "telegraf";

export const startKeyboard = Markup.keyboard([
    [Markup.button.callback('🔍 Поиск'),
    Markup.button.callback('✈️ Направления')],
]).oneTime().resize()