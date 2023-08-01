//Import the mongoose module
const mongoose = require("mongoose");
require('dotenv').config()
class Database {
  // Singleton
  connection = mongoose.connection;

  constructor() {
    try {
      this.connection
        .on("open", console.info.bind(console, "Database connection: open"))
        .on("close", console.info.bind(console, "Database connection: close"))
        .on(
          "disconnected",
          console.info.bind(console, "Database connection: disconnecting")
        )
        .on(
          "disconnected",
          console.info.bind(console, "Database connection: disconnected")
        )
        .on(
          "reconnected",
          console.info.bind(console, "Database connection: reconnected")
        )
        .on(
          "fullsetup",
          console.info.bind(console, "Database connection: fullsetup")
        )
        .on("all", console.info.bind(console, "Database connection: all"))
        .on("error", console.error.bind(console, "MongoDB connection: error:"));
    } catch (error) {
      console.error(error);
    }
  }

  connect = async () => {
    return new Promise((resolve) => {
      //console.log(`Environment Loaded = ${process.env.NODE_ENV}`);
      const userNameDB = process.env.DATABASE.replace(
        "AKRAM",
        process.env.DATABASE_USERNAME
      );

      const mongoConnection = userNameDB.replace(
        "AKRAM",
        process.env.DATABASE_PASSWORD
      );

      // MongoDB - Atlas database connection.
      const connectionParams = {
        useNewUrlParser: true,
        useUnifiedTopology: true
      };

      mongoose.connect(mongoConnection, connectionParams).then(() => {
        console.log(`MongoDB Atlas database connected successfully ...`);
        resolve();
      });
    });
  };

  async close() {
    try {
      await this.connection.close();
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = new Database();
