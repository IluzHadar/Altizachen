import express from 'express'
import path from 'path'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import pkg from 'cloudinary'
import seedRouter from './routes/seedRoutes.js'
import productRouter from './routes/productRoutes.js'
import userRouter from './routes/userRouters.js'
import uploadRouter from './routes/uploadRoutes.js'
//import commetRouter from './routes/commetRoutes.js';

dotenv.config()
const cloudinary = pkg

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to db ')
  })
  .catch((err) => {
    console.log(err.message)
  })

const app = express()
app.use(express.json())
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
})

//API in order to connect between data123 to mongoDB
app.use('/api/seed', seedRouter)
app.use('/api/products', productRouter)
app.use('/api/users', userRouter)
app.use('/api/upload', uploadRouter)
//app.use('/api/commends', commetRouter);

const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

app.use(express.static(path.join(__dirname, '/frontend/build')))

app.get('*', (req, res) =>
  res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
)

//backend
const port = process.env.PORT || 5000
app.listen(port, () => {
  //The server listen to req from the frontend
  console.log(`serve at http://localhost:${port}`)
})
