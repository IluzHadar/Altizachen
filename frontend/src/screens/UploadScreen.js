import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';

import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
} from '@react-google-maps/api';

const UploadScreen = () => {
  const { state } = useContext(Store);
  const { user } = state;
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [category, setcategory] = useState(null);
  const location = useRef(null);

  const [description, setDescription] = useState('');

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyBB5c0WLGH8nTZEZO06ThVwmNdK5KWSfyQ',
    libraries: ['places'],
  });
  const onAutocompleteLoad = (autocomplete) => {
    // Access the google object within the Autocomplete component
    // and perform any necessary operations.
    console.log(autocomplete.getPlace());
  };

  // Rest of your component code...

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
        // lat && lng &&
        console.log(location);
        return;
      }
      product.UploadTime = new Date().toLocaleDateString();
      product.numberPhoneUser = user.numberPhone;
      product.OwnerName = user.name;
      product.location = location.current.value;
      product.CountComments = 0;
      product.pauseAd = false;
      product.reviews = [];
      product.like = 0;
      product.LastReqNumber = 0;
      product.OwnerRating = 0;

      product.OwnerAdID = user._id;
      const { data } = await axios.post(`/api/products`, { product });
      navigate('/');

      window.alert('Ad uplod successfully');
    } catch (error) {
      console.log(error);
      setErrorMsg(error.response.data.message);
    }
  };

  if (!isLoaded) return <div>Loading...</div>;
  return (
    <React.Fragment>
      {errorMsg && <MessageBox variant="danger">{errorMsg}</MessageBox>}
      <Form onSubmit={submitHandler}>
        <h1 style={{ fontWeight: 'bold' }}>Upload Product Page</h1>
        <br></br>
        <Form.Group className="mt-2" controlId="name">
          <Form.Label style={{ fontWeight: 'bold' }}>Name:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className="mt-2" controlId="image">
          <Form.Label style={{ fontWeight: 'bold' }}>Image:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter image url"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          ></Form.Control>
          <Form.Control
            style={{ padding: '10px' }}
            type="file"
            id="image-file"
            label="Choose file"
            custom
            onChange={uploadFileHandler}
          />
          {uploading && <MessageBox variant="info">{'Loading...'}</MessageBox>}
        </Form.Group>

        <Form.Group className="mt-2" controlId="category">
          <Form.Label style={{ fontWeight: 'bold' }}>
            Select Category:
          </Form.Label>
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
            <option value="5">Design products</option>
            <option value="6">Animel products</option>
          </Form.Control>
        </Form.Group>

        <Form.Group className="mt-2" controlId="location">
          <Form.Label style={{ fontWeight: 'bold' }}>Location:</Form.Label>
          <Autocomplete onLoad={onAutocompleteLoad}>
            <input
              type="text"
              placeholder="Enter Location"
              ref={location}
              style={{
                boxSizing: `border-box`,
                border: `1px solid #e5e5e5`,
                width: `100%`,
                height: `32px`,
                padding: `2px 12px`,
                borderRadius: `3px`,
                fontSize: `16px`,

                textOverflow: `ellipses`,
              }}
            />
          </Autocomplete>
        </Form.Group>

        <Form.Group className="mt-2" controlId="description">
          <Form.Label style={{ fontWeight: 'bold' }}>Description:</Form.Label>
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
