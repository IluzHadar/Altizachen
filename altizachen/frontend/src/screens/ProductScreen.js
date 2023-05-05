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

function ProductScreen() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { user } = state;
  const [body, setBody] = useState('');
  const params = useParams();
  const { id } = params;
  const [errorMsg, setErrorMsg] = useState(null);
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
      const comment = { body };
      if (!body) {
        setErrorMsg('Enter txet into comment body');
      }

      product.CountComments = product.CountComments + 1;
      const { data1 } = await axios.put(
        `/api/products/${product._id}`,
        product
      );

      comment.IdOfProduct = product._id;
      comment.commentID = 14;
      comment.UploadDate = new Date().toLocaleDateString();
      comment.EmailOwner = user.email;
      comment.PhoneOwner = user.numberPhone;
      comment.CommentOwner = user.name;
      const { data } = await axios.post(`/api/commends`, { comment });
      navigate('/');
    } catch (error) {
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
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Helmet>
                <title>{product.name}</title>
              </Helmet>
              <h1>{product.name}</h1>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Uplaod time:</Col>
                <Col>{product.UploadTime}</Col>
                <br></br>
                {product._id}
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
                <Col>Description:</Col>
                <Col>{product.description}</Col>
              </Row>
            </ListGroup.Item>
          </ListGroup>

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
      <div></div>
      <Row>
        <React.Fragment>
          {errorMsg && <MessageBox variant="danger">{errorMsg}</MessageBox>}
          <Form onSubmit={submitHandler}>
            <div class="container">
              <div class="row">
                <div class="col">{/* left side*/}</div>
                <div class="col">
                  <Card style={{ width: '30rem', padding: '15px' }}>
                    <Form>
                      <Form.Group className="mt-2">
                        <Col>
                          <div
                            style={{
                              fontWeight: 'bold',
                              textDecoration: 'underline',
                              display: 'inline',
                            }}
                          >
                            New comment from:{' '}
                          </div>
                          <div
                            style={{ fontWeight: 'bold', display: 'inline' }}
                          >
                            {' '}
                            {user.name}
                          </div>
                        </Col>
                      </Form.Group>
                      <Form.Group
                        className="mt-2"
                        controlId="exampleForm.ControlTextarea1"
                      >
                        <Form.Label style={{ fontWeight: 'bold' }}>
                          Body:{' '}
                        </Form.Label>
                        <Form.Control
                          placeholder="Write a new comment..."
                          type="text"
                          value={body}
                          onChange={(e) => setBody(e.target.value)}
                          rows={3}
                        />
                      </Form.Group>
                    </Form>

                    <Button
                      className="mt-2"
                      type="submit"
                      variant="success"
                      style={{ width: '100px' }}
                    >
                      Post
                    </Button>
                  </Card>
                </div>
              </div>
            </div>
          </Form>
        </React.Fragment>
      </Row>
    </div>
  );
}

export default ProductScreen;
