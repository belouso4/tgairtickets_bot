
import mongoose from 'mongoose';

const DB_URL = process.env.NODE_ENV === 'production' ?
    `mongodb+srv://${process.env.MDB_USER}:${process.env.MDB_PASSWORD}@cluster0.wkcthjl.mongodb.net/${process.env.MDB_DATABASE}?retryWrites=true&w=majority&appName=Cluster0` :
    `mongodb://MongoDB-7.0:27017/${process.env.MDB_DATABASE}`

const MDBConnect = async () => {
    try {
        await mongoose.connect(DB_URL);
        console.log('Connected to MongoDB');
    } catch (error) {
        throw new Error(`DB connection error: ${error}`);
    }
};

export default MDBConnect;