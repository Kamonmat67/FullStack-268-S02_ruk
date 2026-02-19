// Description: REST API with MongoDB
// npm install express mongoose body-parser
// Run this file with node MongoDBREST.js
// Test with Postman

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// Database connection
mongoose.connect(
  "mongodb://admin:MSVcdk55472@node86133-fs-268-thu-k.th.app.ruk-com.cloud:11825",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Define the book & Model|Schema
const Book = mongoose.model("Book", {
  id: {
    type: Number,
    unique: true,      // Ensures uniqueness of the "id" field
    required: true,    // If you want "id" to be required
  },
  title: String,
  author: String,
});

const app = express();
app.use(bodyParser.json());

// CREATE
app.post("/books", async (req, res) => {
  try {
    // Get the last book record to determine the next ID
    const lastBook = await Book.findOne().sort({ id: -1 });
    const nextId = lastBook ? lastBook.id + 1 : 1;

    // Create a new book with the next ID
    const book = new Book({
      id: nextId,
      ...req.body,
    });

    await book.save();
    res.send(book);
  } catch (error) {
    res.status(500).send(error);
  }
});

// READ ALL
app.get("/books", async (req, res) => {
  try {
    const books = await Book.find();
    res.send(books);
  } catch (error) {
    res.status(500).send(error);
  }
});

// READ ONE
app.get("/books/:id", async (req, res) => {
  try {
    const book = await Book.findOne({ id: req.params.id });
    res.send(book);
  } catch (error) {
    res.status(500).send(error);
  }
});

// UPDATE
app.put("/books/:id", async (req, res) => {
  try {
    const book = await Book.findOneAndUpdate({ id: req.params.id }, req.body, {
      new: true
    });
    res.send(book);
  } catch (error) {
    res.status(500).send(error);
  }
});

// DELETE
app.delete("/books/:id", async (req, res) => {
  try {
    const book = await Book.findOneAndDelete({ id: req.params.id });
    res.send(book);
  } catch (error) {
    res.status(500).send(error);
  }
});

// START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
