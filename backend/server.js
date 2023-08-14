import dotenv from "dotenv";
import app from './app.js';
import connectDb from "./db/database.js";

// ********* Handling Uncaught Exception **********
process.on("uncaughtException", (error) => {
  console.log(`Error ${error.message}`);
  console.log("Shutting down the server for handling uncaught exceptions");

  process.exit(1);
});


// ********* Config **********
if (process.env.NODE_ENV !== "PRODUCTION") {
  dotenv.config({
    path: "config/.env",
  });
}


// *********Connect to DATABASE **********
connectDb();

// Create Server
const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});


// ********* Uhandled Promise Rejection **********
process.on("unhandledRejection", (error) => {
  console.log(`Error ${error.message}`);
  console.log(
    "Shutting down the server for handling uncaught promise rejection"
  );

  server.close(() => {
    process.exit(1);
  });
});
