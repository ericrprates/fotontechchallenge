require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./routes");

class App {
  constructor() {
    this.express = express();
    this.server = require("http").Server(this.express);

    this.middlewares();
    this.database();
    this.routes();
  }

  middlewares() {
    this.express.use(cors());
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: true }));
    this.express.use(morgan("dev"));
  }

  async database() {
    try {
      mongoose.set("useCreateIndex", true);
      await mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: process.env.DB_NAME,
        useFindAndModify: false
      });
    } catch (e) {
      console.log(e);
    }
  }

  routes() {
    this.express.use(routes);
  }
}

module.exports = new App().server;
