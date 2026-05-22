const { pool } = require("../config/database");

let books = [
    {
        id: 1,
        title: "Clean Code",
        author: "Robert C. Martin",
    },
    {
        id: 2,
        title: "Clean Code",
        author: "Robert C. Martin",  
    },
];

const getAllBooks = async (req, res) => {
     try {
        const result = await pool.query("SELECT * FROM books ORDER BY id ASC");

        res.json({
        message: "Books retrieved successfully",
        data: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve books",
      error: error.message,
    });
  }
};

const getBookById = async (req, res) => {
    try {
       const id = Number(req.params.id);

    const result = await pool.query("SELECT * FROM books WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    res.json({
      message: "Book retrieved successfully",
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve book",
      error: error.message,
      });
    }
};

const createBook = async (req, res) => {
    try{
      const {title, author} = req.body;

    if (!title || !author){
        return res.status(400).json({
            message: "Title and author are required",
        });
      }

    const result = await pool.query(
        "INSERT INTO books (title, author) VALUES ($1, $2) RETURNING *",
        [title, author]
    );
      
    res.status(201).json({
        message: "Book created successfully",
        data: result.rows[0],
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to create book",
        error: error.message,
      });
    }
};

const updateBook = async (req, res) => {
    try{
      const id = Number(req.params.id);
      const { title, author } = req.body;

      if (!title || !author) {
        return res.status(400).json({
            message: "Title and author are required",
        });
    }
    
      const result = await pool.query(
        "UPDATE books SET title = $1, author = $2 WHERE id = $3 RETURNING *",
        [title, author, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
            message: "Book not found",
        });
      }
      res.json({
        message: "Book updated successfully",
        data: result.rows[0],
        });
    } catch (error){
        res.status(500).json({
            message: "Failed to update book",
            error: error.message,
        });
    }
};

const deleteBook = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const result = await pool.query(
      "DELETE FROM books WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    res.json({
      message: "Book deleted successfully",
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete book",
      error: error.message,
    });
  }
};


module.exports ={
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};