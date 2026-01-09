import dotenv from "dotenv";
import app from "./app.js";
import { connectdb } from "./config/db.js";

dotenv.config();
connectdb();
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
