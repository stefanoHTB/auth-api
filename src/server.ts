require('dotenv').config();

import express from "express";
import mongoose from "mongoose";
import verifyJWT from "./middleware/verifyJWT";
import registerRoute from "./routes/registerRoute"
import loginRoute from "./routes/loginRoute"
import logoutRoute from "./routes/logoutRoute"
import refreshRoute from "./routes/refreshRoute"

const connectDB = require('./config/dbConn');
const cookieParser = require('cookie-parser');
const cors = require('cors')


const port = process.env.PORT || 3001;

connectDB();

const app = express();

//PRODUCTION
// var corsOptions = {
//   origin: "*",
//   credentials: true
// };

//TESTING
var corsOptions = {
  origin: "http://localhost:5173",
  credentials: true
};


app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());


app.use("/api/register", registerRoute);
app.use("/api/login", loginRoute);
app.use("/api/logout", logoutRoute);
app.use("/api/refresh", refreshRoute);

app.use(verifyJWT);


mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });
    });