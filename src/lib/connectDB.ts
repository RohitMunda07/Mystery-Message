import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number // this is optional 
};

const connection: ConnectionObject = {};

export const connectDB = async () => {
    // check existing connection
    if (connection.isConnected) {
        console.log("Database Aready Connected");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGO_URI! || '', {});

        console.log("DB Connection", db.connections);

        connection.isConnected = db.connections[0].readyState;

        console.log("DB Connected Successfully");

    } catch (error) {
        console.log("Something went wrong while connecting to MogoDB", error);
        process.exit(1);
    }
}
