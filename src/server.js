const express = require("express");
const cors = require("cors");
require("dotenv").config();

const bookRoutes = require("./routes/book.routes");
const { initDb } = require("./config/database");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

let books = [
  {
    id: 1,
    title: "Clean Code",
    author: "Robert C. Martin",
  },
  {
    id: 2,
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
  },
];

// Health check
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
  }catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();

app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});

// Get all books
app.get("/api/books", (req, res) => {
  res.json({
    message: "Books retrieved successfully",
    data: books,
  });
});

// Get book by id
app.get("/api/books/:id", (req, res) => {
  const id = Number(req.params.id);

  const book = books.find((book) => book.id === id);

  if (!book) {
    return res.status(404).json({
      message: "Book not found",
    });
  }

  res.json({
    message: "Book retrieved successfully",
    data: book,
  });
});

// Create new book
app.post("/api/books", (req, res) => {
  const { title, author } = req.body;

  if (!title || !author) {
    return res.status(400).json({
      message: "Title and author are required",
    });
  }

  const newBook = {
    id: books.length + 1,
    title,
    author,
  };

  books.push(newBook);

  res.status(201).json({
    message: "Book created successfully",
    data: newBook,
  });
});

// Update book
app.put("/api/books/:id", (req, res) => {
  const id = Number(req.params.id);
  const { title, author } = req.body;

  const book = books.find((book) => book.id === id);

  if (!book) {
    return res.status(404).json({
      message: "Book not found",
    });
  }

  if (!title || !author) {
    return res.status(400).json({
      message: "Title and author are required",
    });
  }

  book.title = title;
  book.author = author;

  res.json({
    message: "Book updated successfully",
    data: book,
  });
});

// Delete book
app.delete("/api/books/:id", (req, res) => {
  const id = Number(req.params.id);

  const bookIndex = books.findIndex((book) => book.id === id);

  if (bookIndex === -1) {
    return res.status(404).json({
      message: "Book not found",
    });
  }

  const deletedBook = books.splice(bookIndex, 1);

  res.json({
    message: "Book deleted successfully",
    data: deletedBook[0],
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});