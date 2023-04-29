import express from 'express';
import Product from '../models/produtModel.js';

const productRouter = express.Router();

productRouter.get('/', async (req, res) => {
  const products = await Product.find();
  res.send(products);
});
 
productRouter.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'product not found' });
  }
});

productRouter.put('/:id', async (req, res) => {
  console.log(req);
  const product = await Product.findById(req.params.id);

  product.CountComments = req.body.CountComments || product.CountComments;
  const updateProduct = await product.save();
  res.send({ message: 'Product Updated', product: updateProduct });
});


  




productRouter.post('/', async (req, res) => {
  const { product } = req.body;
  try {
    const createdProduct = await Product.create(product);
    res.status(201).json(createdProduct);
 } catch (err) {
    console.log(product);
    console.log(err);
    res.status(404).send({ message: 'Error - Try Again' });
  }
});

export default productRouter;
