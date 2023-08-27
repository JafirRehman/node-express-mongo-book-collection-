/*dependies
"body-parser": "^1.20.2",
"ejs": "^3.1.9",
"express": "^4.18.2",
"mongoose": "^7.4.4",*/

// app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect('mongodb://127.0.0.1:27017/bookCollectionDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
});

const Book = mongoose.model('Book', bookSchema);

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/add', function (req, res) {
  res.render('add');
});

app.post('/add', async function (req, res) {
  try {
    const newBook = new Book({
      title: req.body.title,
      author: req.body.author,
    });

    await newBook.save();

    res.redirect('/list');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error adding book to the collection.');
  }
});

app.get('/list', async function (req, res) {
  try {
    const books = await Book.find({});
    res.render('list', { books: books });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching book list.');
  }
});

app.listen(3000, function () {
  console.log('Server started on port 3000');
});
