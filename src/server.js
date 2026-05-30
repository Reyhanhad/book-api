const express = require("express");
const cors = require("cors");
require("dotenv").config();

const bookRoutes = require("./routes/book.routes");
const { initDb, checkDb } = require("./config/database");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/health", async (req, res) => {
  try {
    await checkDb();

    res.json({
      status: "ok",
      database: "connected",
    });
  } catch (error) {
    res.status(503).json({
      status: "error",
      database: "disconnected",
      error: error.message,
    });
  }
});

app.get("/", (req, res) => {
  res.json({
    message: "Book API is running",
  });
});

app.use("/api/books", bookRoutes);

const startServer = async () => {
  try {
    await initDb();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
