const { Pool } = require("pg");

const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

const initDb = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS books (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          author VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
    `);
    
    const result = await pool.query("SELECT COUNT(*) FROM books");
    const count = Number(result.rows[0].count);

    if (count === 0) {
        await pool.query(`
            INSERT INTO books (title, author)
            VALUES
              ('Clean Code', 'Robert C. Martin'),
              ('Designing Data-Intensive Applications', 'Martin Kleppmann');
            `);
    }
};

module.exports = {
    pool,
    initDb,
};