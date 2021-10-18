const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Product = require('./models/product');

const app = express();
mongoose.connect('mongodb+srv://root:toor@cluster0.ay4sl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
//    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:8081');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

app.post('/api/products', (req, res, next) => {
    console.log("CREATE");
  delete req.body._id;
  const product = new Product({
    ...req.body
  });
  product.save()
    .then(product => res.status(201).json({ product }))
    .catch(error => res.status(400).json({ error: error }));
});

app.delete('/api/products/:id', (req, res, next) => {
    console.log("DELETE");
  Product.deleteOne({_id: req.params.id})
    .then(() => res.status(200).json({ message: 'Deleted!'}))
    .catch(error => res.status(400).json({ error: error }));
});

app.put('/api/products/:id', (req, res, next) => {
    console.log("UPDATE");
  Product.updateOne({_id: req.params.id}, { ...req.body, _id: req.params.id})
    .then(() => res.status(200).json({ message: 'Modified!'}))
    .catch(error => res.status(400).json({ error: error }));
});

app.get('/api/products/:id', (req, res, next) => {
    console.log("READ ONE");
  Product.findOne({_id: req.params.id})
    .then(product => res.status(200).json({ product: product }))
    .catch(error => res.status(404).json({ error: error }));
});

app.get('/api/products', (req, res, next) => {
    console.log("READ ALL");
  Product.find()
    .then(products => res.status(200).json({ products: products }))
    .catch(error => res.status(400).json({ error: error }));
});

module.exports = app;