# Book API

A simple REST API for managing books, built with Node.js, Express.js, PostgreSQL, Docker, and GitHub Actions.

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Docker
- Docker Compose
- GitHub Actions

## Features

- Get all books
- Get book by ID
- Create a new book
- Update book
- Delete book
- PostgreSQL database integration
- Dockerized application
- CI workflow with GitHub Actions

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Health check |
| GET | `/api/books` | Get all books |
| GET | `/api/books/:id` | Get book by ID |
| POST | `/api/books` | Create new book |
| PUT | `/api/books/:id` | Update book |
| DELETE | `/api/books/:id` | Delete book |

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000

DB_HOST=db
DB_PORT=5432
DB_USER=book_user
DB_PASSWORD=book_password
DB_NAME=book_db
