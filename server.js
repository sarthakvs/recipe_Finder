const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname+'/public'));
mongoose.connect('mongodb://0.0.0.0:27017/recipe-finder', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB', error);
  });

const recipeSchema = new mongoose.Schema({
  name: String,
  ingredients: [String],
  instructions: String
});
const Recipe = mongoose.model('Recipe', recipeSchema);
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.get('/recipes', (req, res) => {
    Recipe.find({})
      .then((recipes) => res.json(recipes))
      .catch((error) => {
        console.error('Error retrieving recipes:', error);
        res.status(500).send('Error retrieving recipes');
      });
  });
app.post('/recipes', (req, res) => {
  const { name, ingredients, instructions } = req.body;
  if (!name || !ingredients || !instructions) {
    return res.status(400).send('Missing required fields');
  }
  const recipe = new Recipe({ name, ingredients: ingredients.split(','), instructions });

  recipe.save()
    .then(() => res.send('Recipe added successfully'))
    .catch((error) => res.status(500).send('Error adding recipe'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
