import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';

const UploadScreen = () => {
  const { state } = useContext(Store);
  const { user } = state;
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [uploading, setUploading] = useState(false);

  const [price, setPrice] = useState(0);
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');

  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [navigate, user]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      const { data } = await axios.post('/api/upload', formData, config);

      setImage(data);
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const product = { name, image, price, description };
      if (!name || !image || !price || !description) {
        setErrorMsg('Enter All Fields');
      }
      const { data } = await axios.post(`/api/products`, { product });
      navigate('/');
    } catch (error) {
      setErrorMsg(error.response.data.message);
    }
  };

  return (
    <React.Fragment>
      {errorMsg && <MessageBox variant='danger'>{errorMsg}</MessageBox>}
      <Form onSubmit={submitHandler}>
        <Form.Group className='mt-2' controlId='name'>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='mt-2' controlId='image'>
          <Form.Label>Image</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter image url'
            value={image}
            onChange={(e) => setImage(e.target.value)}
          ></Form.Control>
          <Form.Control
            type='file'
            id='image-file'
            label='Choose file'
            custom
            onChange={uploadFileHandler}
          />
          {uploading && <MessageBox variant='info'>{'Loading...'}</MessageBox>}
        </Form.Group>

        <Form.Group className='mt-2' controlId='price'>
          <Form.Label>Price</Form.Label>
          <Form.Control
            type='number'
            placeholder='Enter price'
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          ></Form.Control>
        </Form.Group>



        <Form.Group className='mt-2' controlId='description'>
          <Form.Label>Description</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter Description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button className='mt-3' type='submit' variant='success'>
          Upload Product
        </Button>
      </Form>
    </React.Fragment>
  );
};

export default UploadScreen;
