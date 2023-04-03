import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useContext, useEffect, useReducer } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import Badge from 'react-bootstrap/Badge';
import { Store } from '../Store';
import { Image, ListGroupItem } from 'react-bootstrap';

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
  const params = useParams();
  const { id } = params;
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

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart } = state;
  const addToCatrHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert(`Sorry. Product is out of stock`);
      return;
    }

    ctxDispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });

    navigate('/cart');
  };
  return loading ? (
    <div>Loding...</div>
  ) : error ? (
    <div> {error} </div>
  ) : (
    <Row>
      <Col sm={12} md={12} lg={6} xl={6} className='rounded text-center'>
        <Card>
          <Card.Body>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <Image
                  className='product-img'
                  src={product.image}
                  alt={product.name}
                  fluid
                />
              </ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>
      </Col>
      <Col sm={12} md={12} lg={3} xl={3}>
        <Card>
          <Card.Body>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <Helmet>
                  <title>{product.name}</title>
                </Helmet>
                <h1>{product.name}</h1>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Price:</Col>
                  <Col>${product.price}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Description:</Col>
                  <Col>{product.description}</Col>
                </Row>
              </ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>
      </Col>
      <Col sm={12} md={12} lg={3} xl={3}>
        <Card>
          <Card.Body>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <Row className='mt-2'>
                  <Col>Price:</Col>
                  <Col>${product.price}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row className='mt-2'>
                  <Col>Status:</Col>
                  <Col>
                    {product.countInStock > 0 ? (
                      <Badge bg='success'>In Stock</Badge>
                    ) : (
                      <Badge bg='danger'>Unavailable</Badge>
                    )}
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroupItem>
                <Row className='mt-2'>
                  <div className='d-grid'>
                    {product.countInStock === 0 ? (
                      <Button variant='light' disabled>
                        {' '}
                        Out of stock
                      </Button>
                    ) : (
                      <Button onClick={() => addToCatrHandler(product)}>
                        Add to cart
                      </Button>
                    )}
                  </div>
                </Row>
              </ListGroupItem>
            </ListGroup>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default ProductScreen;
