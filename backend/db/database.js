import mongoose from "mongoose";

const connectDb = () => {
    mongoose.connect(process.env.MONGO_DB_URL, {
        dbName: "e-shop"
      }).then((data) => {
        console.log(`MongoDb connected with server ${data.connection.host}`)
    });
};

export default connectDb