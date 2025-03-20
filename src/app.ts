import express from "express";
import config from "config";

const app = express();

// Middleware
app.use(express.json());

// app port
const port = config.get<number>("port");

app.listen(port, async () => {
  console.log(`Server started on port ${port}!`);
});

//Routes
import index from "./routes/index";
app.use("/test", index);

export default app;
