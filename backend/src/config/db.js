const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try {
      await mongoose.connect(
        `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@localhost:27017/${process.env.MONGO_DB_NAME}?authSource=admin`,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }
      );

      console.log("MongoDB Connected Successfully");
    } catch (error) {
      console.error("MongoDB Connection Failed:", error);
      process.exit(1);
    }
}

module.exports = connectDB;