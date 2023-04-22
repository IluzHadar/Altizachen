import { useEffect, useReducer } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import logger from 'use-reducer-logger';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';


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

function MainScreen() {
  
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
                  <a class="nav-link" href="#">Disabled</a>
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
                    style={{padding:"20px"}}
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
                      <Card.Title style={{fontWeight: 'bold'}}>{product.name}</Card.Title>
                      <Card.Text style={{textAlign: "center"}}>
                          <strong>Price: {product.price}₪</strong>
                        </Card.Text>
                        <Link to={`/product/${product._id}`} type="button" class="btn btn-info" style={{color:'white', width: '120px'}}>
                            <strong>Enter the ad</strong>
                        </Link>
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

export default MainScreen;
