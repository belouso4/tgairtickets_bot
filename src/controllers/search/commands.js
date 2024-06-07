export const searchCommands = (bot) => {
    bot.on('inline_query', async (ctx) => {
        const offset = parseInt(ctx.inlineQuery.offset) || 0;
        let debounceTimeout;


        const regexQuery = ctx.inlineQuery.query.match(/(to|from):\s*([^\s].*)/gi)
        const query = regexQuery ? regexQuery[0].split(':') : null

        if (!query) return
        if (ctx.inlineQuery.offset) return
        // Сброс предыдущего таймера
        clearTimeout(debounceTimeout);

        // Установка нового таймера
        debounceTimeout = setTimeout(() => {
            fetchData();
        }, 2000); // Задержка 300 мс


        const fetchData = async () => {
            if (query[1].trim().length > 2) {
                let items = await Flight.autocomplete(query[1].trim(), ['country', 'city']);
                if (!items) return

                let results = items.slice(offset, offset + 10).map((item) => {
                    const search = {
                        type: "article",
                        id: item.id,
                        title: item.name,
                        input_message_content: {
                            message_text: `${query[0]}: ${item.name}`
                        }
                    }

                    if (item.type === 'city') {
                        search.description = item.country_name
                    }

                    return search
                });
                let ourReturn = await ctx.answerInlineQuery(results, { is_personal: true, next_offset: offset + results.length, cache_time: 10 });

                return ourReturn;
            }
        }
    });
}

export default searchCommands