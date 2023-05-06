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
  const product = await Product.findById(req.params.id);
  console.log('1-------------------------------------------------------------');
  console.log(req.body);
  console.log('1-------------------------------------------------------------');

 
    
  if(req.body.LastReqNumber === 0){

     console.log('insert into : req.body.LastReqNumber === 0');

  //product.CountComments = req.body.CountComments || product.CountComments;
  product.reviews = req.body.reviews;
  const updateProduct = await product.save();
  console.log('..................updateProduct.....................');
  console.log(updateProduct);
  console.log('..................product.save().....................');
  console.log(product);
  res.send({ message: 'Product Updated', product: updateProduct });
  }

  if(req.body.LastReqNumber === 1){

    console.log('insert into : req.body.LastReqNumber === 1');

  product.like = req.body.like;
  product.LastReqNumber = 0;
  const updateProduct1 = await product.save();
  res.send({ message: 'Product Updated', product: updateProduct1 });
  }

  
});


productRouter.post('/', async (req, res) => {
  const { product } = req.body;
  try {
    const createdProduct = await Product.create(product);
    res.status(201).json(createdProduct);
 } catch (err) {
    res.status(404).send({ message: 'Error - Try Again' });
  }
});

export default productRouter;
