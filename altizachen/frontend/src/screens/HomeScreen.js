import { useEffect, useReducer } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import logger from 'use-reducer-logger';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { useContext } from 'react';
import { Store } from '../Store';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, products: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, erroe: action.payload };
    default:
      return state;
  }
};

function HomeScreen() {
  
  const [{ products }, dispatch] = useReducer(logger(reducer), {
    products: [],
    loading: true,
    error: '',
  });
  //const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('/api/products');
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }

      //setProducts(result.data);
    };
    fetchData();
  }, []);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === products._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert(`Sorry. Product is out of stock`);
      return;
    }
    ctxDispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } });
  };

  return (


    <div class="card text-center">
          <div class="card-header">
            <ul class="nav nav-tabs card-header-tabs">
              <li class="nav-item">
                  <a class="nav-link active" href="#">Active</a>
              </li>

              <li class="nav-item">
                  <a class="nav-link" href="#">Link</a>
              </li>

              <li class="nav-item">
                  <a class="nav-link disabled" href="#">Disabled</a>
              </li>
            </ul>
        </div>

        <div class="card-body">
              
                <div>
                   <div className='products'>
                {products.map((product) => (
                  <Col
                    className='align-items-stretch d-flex'
                    key={product._id}
                    sm={12}
                    md={6}
                    lg={4}
                    xl={3}
                  >
                
                    <Card className='w-100 h-80 my-3 p-3 rounded text-center'>
                      <Link
                        style={{
                          height: '100%',
                        }}
                        to={`/product/${product._id}`}
                      >
                        <Card.Img
                          style={{
                            height: '100%',
                          }}
                          src={product.image}
                          alt={product.name}
                          variant='top'
                        />
                      </Link>
                      <Card.Body>
                        <Link to={`/product/${product._id}`}>
                          <Card.Title as='div'>
                            <strong>{product.name}</strong>
                          </Card.Title>
                        </Link>
                        <Card.Text>
                          <strong>${product.price}</strong>
                        </Card.Text>
                        {product.countInStock === 0 ? (
                          <Button variant='light' disabled>
                            {' '}
                            Out of stock
                          </Button>
                        ) : (
                          <Button onClick={() => addToCartHandler(product)}>
                            Add to cart
                          </Button>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </div>
            </div>

          </div>
    </div>

    
  );
}

export default HomeScreen;
