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
  const [category, setcategory] = useState(null);

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
      const product = { name, image, category, description };
      if (!name || !image || !description || !category) {
        setErrorMsg('Enter All Fields');
      }
      product.UploadTime = new Date().toLocaleDateString();
      product.numberPhoneUser = user.numberPhone;
      product.OwnerName = user.name;
      product.CountComments = 0;
      product.pauseAd = false;
      product.reviews = [];
      product.like = 0 ;
      product.LastReqNumber = 0;
      product.OwnerAdID = user._id;
      const { data } = await axios.post(`/api/products`, { product });
      navigate('/');
    } catch (error) {
      console.log(error);
      setErrorMsg(error.response.data.message);
    }
  };

  return (
    <React.Fragment>
      {errorMsg && <MessageBox variant="danger">{errorMsg}</MessageBox>}
      <Form onSubmit={submitHandler}>
        <h1 style={{ fontWeight: 'bold' }}>Upload Product Page</h1>
        <br></br>
        <Form.Group className="mt-2" controlId="name">
          <Form.Label>Name:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className="mt-2" controlId="image">
          <Form.Label>Image:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter image url"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          ></Form.Control>
          <Form.Control
            type="file"
            id="image-file"
            label="Choose file"
            custom
            onChange={uploadFileHandler}
          />
          {uploading && <MessageBox variant="info">{'Loading...'}</MessageBox>}
        </Form.Group>

        <Form.Group className="mt-2" controlId="category">
          <Form.Label>Select Category:</Form.Label>
          <Form.Control
            as="select"
            defaultValue="0"
            value={category}
            onChange={(e) => setcategory(e.target.value)}
          >
            <option value="0">Plase select option</option>
            <option value="1">Forniture</option>
            <option value="2">Electrical products</option>
            <option value="3">Home producats</option>
            <option value="4">Garden producats</option>
            <option value="5">Car products</option>
            <option value="6">Animel products</option>
          </Form.Control>
        </Form.Group>

        <Form.Group className="mt-2" controlId="description">
          <Form.Label>Description:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button className="mt-3" type="submit" variant="success">
          Upload Product
        </Button>
      </Form>
    </React.Fragment>
  );
};

export default UploadScreen;
