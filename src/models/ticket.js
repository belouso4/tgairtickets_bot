
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const ticketSchema = new Schema({
    _id: ObjectId,
    user_id: Number,
    flight_number: String,
    link: String,
    origin_airport: String,
    destination_airport: String,
    departure_at: Date,
    return_at: Date,
    airline: String,
    destination: String,
    origin: String,
    price: Number,
    return_transfers: Number,
    duration_to: Number,
    duration_back: Number,
    transfers: Number,
});

const Ticket = mongoose.model('Ticket', ticketSchema);
export default Ticket