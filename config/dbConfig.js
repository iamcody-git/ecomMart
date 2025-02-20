import mongoose from "mongoose";

if (!global.mongoose) {
    global.mongoose = { conn: null, Promise: null };
}

let cached = global.mongoose;
console.log("connected");

async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.Promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.Promise = mongoose.connect(`${process.env.MONGODB_URI}/quickcart`, opts).then((mongoose) => {
            return mongoose;
        });
    }

    cached.conn = await cached.Promise;
    return cached.conn;
}

export default connectDB;
