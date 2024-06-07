
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
    user_id: {
        type: Number,
        unique: true,
        required: true,
    },
    to_watch: [{
        origin: String,
        origin_city_name: String,
        destination_city_name: String,
        destination: String,
        date: String,
        one_way: Boolean,
        direct: Boolean,
        lower_price: {
            type: Number,
            default: null
        },
    }]
});

const User = mongoose.model('User', userSchema);
export default User