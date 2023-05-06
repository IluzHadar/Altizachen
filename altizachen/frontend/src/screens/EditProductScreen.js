import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import MessageBox from '../components/MessageBox';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import Badge from 'react-bootstrap/Badge';
import { Image } from 'react-bootstrap';
import { Store } from '../Store';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, erroe: action.payload };
    default:
      return state;
  }
};

function EditProductScreen() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { user } = state;
  const [body, setBody] = useState('');
  const params = useParams();
  const { id } = params;
  const [errorMsg, setErrorMsg] = useState(null);

  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [category, setcategory] = useState(null);
  const [pauseAd, setPauseAd] = useState(null);

  const [description, setDescription] = useState('');
  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    product: [],
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/products/${id}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchData();
  }, [id]);


  const submitHandler = async (e) => {
    e.preventDefault();
    try {
    const product1 = { name, category, description,  pauseAd};
      if (!name || !description || !category || !pauseAd) {
        setErrorMsg('Enter All Fields');
      }
      product1.UploadTime = new Date().toLocaleDateString();
      product1.LastReqNumber = 2;
      product1._id = product._id;
      const { data } = await axios.put(`/api/products/${product._id}`,product1);
      navigate('/');
    } catch (error) {
      console.log('Error in edit of product');
      console.log(error);
      setErrorMsg(error.response.data.message);
    }
  };

  return loading ? (
    <div>Loding...</div>
  ) : error ? (
    <div> {error} </div>
  ) : (
    <div>
      {errorMsg && <MessageBox variant="danger">{errorMsg}</MessageBox>}
      <Form onSubmit={submitHandler}>
        <h1 style={{ fontWeight: 'bold', textAlign: 'center' }}>
          Edit Product
        </h1>
        <Row>
          <Col>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Image
                    className="rounded"
                    src={product.image}
                    alt={product.name}
                    fluid
                  />
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Col>
          <Col>
            <Form.Group className="mt-2" controlId="name">
              <Form.Label>Name:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter new Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <ListGroup variant="flush">
              <ListGroup.Item>
                <Row>
                  <Col>Last date:</Col>
                  <Col>{product.UploadTime}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Count Comments:</Col>
                  <Col>{product.CountComments}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Number phone:</Col>
                  <Col>{product.numberPhoneUser}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Form.Group className="mt-2" controlId="category">
                    <Form.Label>Select New Category:</Form.Label>
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
                </Row>
                </ListGroup.Item>
                
                <ListGroup.Item>
                <Row>
                  <Form.Group className="mt-2" controlId="description">
                    <Form.Label>Description:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter New Description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Form.Group className="mt-2" controlId="category">
                    <Form.Label>The last status of product is : {String(product.pauseAd)}
                    <br></br>Pause Ad:</Form.Label>
                    <Form.Control
                      as="select"
                      defaultValue="0"
                      value={pauseAd}
                      onChange={(e) => setPauseAd(e.target.value)}>
                      <option value={false}>No</option>
                      <option value={true}>Yes</option>
                    </Form.Control>
                  </Form.Group>
                </Row>
                </ListGroup.Item>


            </ListGroup>

            <Button className="mt-3" type="submit" variant="success">
              Update Product !
            </Button>

            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item></ListGroup.Item>
                <ListGroup.Item>
                  <Row className="mt-2"></Row>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default EditProductScreen;
