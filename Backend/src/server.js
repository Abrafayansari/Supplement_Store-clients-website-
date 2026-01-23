import dotenv from "dotenv";
import app from "./app.js";
import { connectdb } from "./config/db.js";

dotenv.config();
const startServer = async () => {
  await connectdb();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();


