import axios from "axios"


export const getLocationBycoordinate = async ({ latitude, longitude, localityLanguage = 'ru' }) => {
    try {
        return (await axios.get(
            'https://api.bigdatacloud.net/data/reverse-geocode-client',
            {
                params: {
                    latitude,
                    longitude,
                    localityLanguage,
                }
            }
        )).data
    } catch (error) {

    }
}