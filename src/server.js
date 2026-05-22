const express = require("express");
const cors = require("cors");
require("dotenv").config();

const bookRoutes = require("./routes/book.routes");
const { initDb } = require("./config/database");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

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