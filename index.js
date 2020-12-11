const Joi = require('joi');
const log = require('./logging');
const Auth = require('./Authenticate');
const helmet = require('helmet');
const morgan = require('morgan');
const express = require('express');
const app = express();

// we have global object PROCESS that gives us to access in current process. It has two Property ene and NODE_ENE




// Express is nothing but a bunch of middleware function.
// Built in middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// add custome middleware
app.use(log);
app.use(Auth);

//Third party middleware
app.use(morgan('tiny')); 
app.use(helmet());

const genres = [
  { id: 1, name: 'Action' },
  { id: 2, name: 'Romantic' },
  { id: 3, name: 'comedy' },
];

app.get('/api/genres', (req, res) => {
  res.send(genres);
});

app.post('/api/genres', (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = {
    id: genres.length + 1,
    name: req.body.name
  };
  genres.push(genre);
  res.send(genre);
});

app.put('/api/genres/:id', (req, res) => {
  const genre = genres.find(c => c.id === parseInt(req.params.id));
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  genre.name = req.body.name;
  res.send(genre);
});

app.delete('/api/genres/:id', (req, res) => {
  const genre = genres.find(c => c.id === parseInt(req.params.id));
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  const index = genres.indexOf(genre);
  genres.splice(index, 1);

  res.send(genre);
});

app.get('/api/genres/:id', (req, res) => {
  const genre = genres.find(c => c.id === parseInt(req.params.id));
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');
  res.send(genre);
});

function validateGenre(genre) {
  const schema = {
    name: Joi.string().min(3).required()
  };

  return Joi.validate(genre, schema);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));