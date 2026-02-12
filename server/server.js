import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import "./src/config/db.js"; // just to initialize DB connection

const PORT = process.env.PORT || 7484;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
