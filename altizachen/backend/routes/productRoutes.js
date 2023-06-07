import express from 'express'
import Product from '../models/produtModel.js'

const productRouter = express.Router()

productRouter.get('/', async (req, res) => {
  const products = await Product.find()

  // Add a check that if 3 days pass since the moment the ad was
  //uploaded/edited then the ad changes to PAUSE status.

  // make all ads pauseAd true
  products.forEach((product) => {
    if (!product.pauseAd) {
      // Only check if the ad is not already paused
      const currentDate = new Date()
      const productUpdatedAt = new Date(product.updatedAt)
      const diffInDays = Math.floor(
        (currentDate - productUpdatedAt) / (1000 * 60 * 60 * 24)
      )

      if (diffInDays >= 3) {
        product.pauseAd = true

        // save the product into the DB
        product.save()
      }
    }
  })

  res.send(products)
})

productRouter.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id)
  console.log(product)

  if (product) {
    res.send(product)
  } else {
    res.status(404).send({ message: 'product not found' })
  }
})

// delete product
productRouter.delete('/:id', async (req, res) => {
  console.log('delete product', req.params.id)
  const product = await Product.findById(req.params.id)
  if (product) {
    await product.remove()
    res.send({ message: 'Product Deleted' })
  } else {
    res.status(404).send({ message: 'Product Not Found' })
  }
})

productRouter.put('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (req.body.LastReqNumber === 0) {
    //Put of: Add a new comment

    console.log('insert into : req.body.LastReqNumber === 0')

    //product.CountComments = req.body.CountComments || product.CountComments;
    product.reviews = req.body.reviews
    const updateProduct = await product.save()
    res.send({ message: 'Product Updated', product: updateProduct })
  }

  if (req.body.LastReqNumber === 1) {
    //Put of:LikeButton in product screen

    console.log('insert into : req.body.LastReqNumber === 1')

    product.like = req.body.like
    product.LastReqNumber = 0
    const updateProduct1 = await product.save()
    res.send({ message: 'Product Updated', product: updateProduct1 })
  }

  if (req.body.LastReqNumber === 2) {
    //Put of: EditScreen

    console.log('insert into : req.body.LastReqNumber === 2')

    product.LastReqNumber = 0
    product.name = req.body.name || product.name
    product.category = req.body.category || product.category
    product.description = req.body.description || product.description
    product.location = req.body.location || product.location
    product.pauseAd = req.body.pauseAd || product.pauseAd
    product.UploadTime = req.body.UploadTime

    const updateProduct2 = await product.save()
    res.send({ message: 'Product Updated', product: updateProduct2 })
  }
})

productRouter.post('/', async (req, res) => {
  const { product } = req.body
  try {
    const createdProduct = await Product.create(product)
    res.status(201).json(createdProduct)
  } catch (err) {
    res.status(404).send({ message: 'Error - Try Again' })
  }
})

export default productRouter
