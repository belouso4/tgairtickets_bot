import axios from "axios"
const token = process.env.AVIASALES_TOKEN;

export default class AviasalesAPI {
    async pricesForDates(filter) {
        const { origin, destination, date: departure_at, limit = 20, one_way = true, direct = true } = filter
        try {
            const { data } = await axios.get('https://api.travelpayouts.com/aviasales/v3/prices_for_dates?', {
                params: {
                    origin,
                    destination,
                    direct,
                    one_way,
                    departure_at,
                    limit,
                    token
                },
            })
            return data.data
        } catch (error) {
            // console.log('error', error)
            console.log(error.response?.data.error || error)
        }
    }

    async getRoute(query) {
        try {
            axios.defaults.headers.common['X-Access-Token'] = '';
            const { data } = await axios.get('https://www.travelpayouts.com/widgets_suggest_params?q=' + query)

            return data
        } catch (error) {
            console.log(error)
        }
    }

    async autocomplete(query, types = ['city']) {
        try {
            const { data } = await axios.get(
                'https://autocomplete.travelpayouts.com/places2',
                {
                    params: {
                        locale: ['ru', 'en'],
                        types,
                        term: query,
                    }
                }
            )

            return data
        } catch (error) {
            console.log(error)
        }
    }


    async fetchData(method = 'get', url, query) {
        try {
            const { data } = await axios[method](url)
            return data
        } catch (error) {
            console.log(error)
        }
    }
}