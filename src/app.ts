// ENV variables
require("dotenv").config();

import express from "express";
import config from "config";

const app = express();

// Middleware
app.use(express.json());

// DB
import db from "../config/db";

//Routes
import userRoutes from "./routes/userRoutes"
import serviceAdRoutes from "./routes/serviceAdRoutes"
import appointmentRoutes from "./routes/appointmentRoutes"
import chatRoutes from "./routes/chatRoutes"

// Logger
import Logger from "../config/logger";

// Middlewares
import morganMiddleware from "./middleware/morganMiddleware";

app.use(morganMiddleware)

app.use("/user", userRoutes)
app.use("/servicead", serviceAdRoutes)
app.use("/appointments", appointmentRoutes)
app.use("/chat", chatRoutes)


// app port
const port = config.get<number>("port");

app.listen(port, async () => {
  await db()
  Logger.info(`Server started on port ${port}!`);
});
