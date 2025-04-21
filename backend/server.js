const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const routes = require("./routes"); // ✅ Make sure this path is correct

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
      console.log("✅ MongoDB Connected");
      app.listen(PORT, () => {
          console.log(`🚀 Server running on port ${PORT}`);
      });
  })
  .catch((err) => {
      console.error("❌ MongoDB connection error:", err);
      process.exit(1); // ✅ Exit process if DB connection fails
  });

app.use("/api", routes); // ✅ Ensure this is correctly imported and used

// ✅ Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal Server Error" });
});
