const express = require('express');
const axios = require('axios');
const app = express();
const bodyParser = require('body-parser');
const path = require("path");

const base_url = "http://localhost:3000";

app.set("views", path.join(__dirname, "/public/views"));
app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

/* =========================
   HOME - SHOW ALL BOOKS
========================= */
app.get("/", async (req, res) => {
    try {
        const response = await axios.get(base_url + '/books');
        res.render("books", { books: response.data });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error');
    }
});

/* =========================
   VIEW ONE BOOK
========================= */
app.get("/book/:id", async (req, res) => {
    try {
        const response = await axios.get(base_url + '/books/' + req.params.id);
        res.render("book", { book: response.data });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error');
    }
});

/* =========================
   CREATE PAGE
========================= */
app.get("/create", (req, res) => {
    res.render("create");
});

/* =========================
   CREATE BOOK
========================= */
app.post("/create", async (req, res) => {
    try {
        const data = {
            title: req.body.title,
            author: req.body.author
        };

        await axios.post(base_url + '/books', data);
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).send('Error');
    }
});

/* =========================
   UPDATE PAGE
========================= */
app.get("/update/:id", async (req, res) => {
    try {
        const response = await axios.get(base_url + '/books/' + req.params.id);
        res.render("update", { book: response.data });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error');
    }
});

/* =========================
   UPDATE BOOK
========================= */
app.post("/update/:id", async (req, res) => {
    try {
        const data = {
            title: req.body.title,
            author: req.body.author
        };

        // ✅ FIXED: ใช้ req.params.id
        await axios.put(base_url + '/books/' + req.params.id, data);

        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).send('Error');
    }
});

/* =========================
   DELETE BOOK
========================= */
app.get("/delete/:id", async (req, res) => {
    try {
        await axios.delete(base_url + '/books/' + req.params.id);
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).send('Error');
    }
});

/* =========================
   START SERVER (เหลือ listen ตัวเดียว)
========================= */
const port = process.env.PORT || 5500;

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});
