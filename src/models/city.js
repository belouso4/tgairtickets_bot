
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const citySchema = new Schema({
    _id: ObjectId,
    name: String,
    time_zone: String,
    country_code: String,
    code: String,
});

const City = mongoose.model('City', citySchema);
export default City