import { useNavigate } from 'react-router-dom';
import { useEffect, useReducer } from 'react';
import { Store } from '../Store';
import { Link } from 'react-router-dom';
import axios from 'axios';
import logger from 'use-reducer-logger';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import React, { useState, useContext } from 'react';
import { Row } from 'react-bootstrap';
import { right } from '@popperjs/core';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import MessageBox from '../components/MessageBox';



const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, products: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, erroe: action.payload };

    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false, successDelete: false };

    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};


function AdminInfoScreen() {
  const navigate = useNavigate();
  const [{ products }, dispatch] = useReducer(logger(reducer), {
    products: [],
    loading: true,
    error: '',
  });

  const [activeLayer, setActiveLayer] = useState(1);


  const handleButtonClick = (layerNumber) => {
    setActiveLayer(layerNumber);
  };


  const { state } = useContext(Store);
  const { user } = state;

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('/api/products');
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchData();
  }, []);

 
  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure to delete?')) {
      console.log('DELETEEEEEEEEEEEEEEEEEEE');
      try {
        await axios.delete(`/api/products/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        dispatch({ type: 'DELETE_SUCCESS' });
      } catch (err) {
        console.log(err);
        dispatch({
          type: 'DELETE_FAIL',
        });
      }
    }
  };



  return (
    
      <div>
          {user &&<h1 style={{ fontWeight: 'bold', textAlign: 'center',padding: '20px' }}>Admin management center</h1>}
          {user &&
      
      <div class="card-body">
        <div style={{ textAlign: 'center'}}>
        <Button  style={{ marginRight: '20px' }} onClick={() => handleButtonClick(1)}>Show Ads</Button>
        <Button style={{ marginLeft: '20px' } }onClick={() => handleButtonClick(2)}>Show Statistic</Button>
        </div>


        <div style={{padding:'20px'}}>
        {activeLayer === 1 && (
          
         
          <div style={{ backgroundColor: 'lightgray', padding: '20px', marginTop: '10px', borderRadius: '10px', textAlign: 'center' }}>
            <h2 style={{color:'white',  fontWeight: 'bold', textDecoration: 'underline'}}>List of Ads in the website </h2>
            <div>

              {user && products.map((product) => (
                  <Col
                    className="align-items-stretch d-flex"
                    key={product._id}
                    sm={12}
                    md={6}
                    lg={4}
                    xl={3}
                    style={{ padding: '20px' }}
                  >
                    <Card className="w-100 h-80 my-3 p-3 rounded text-center">
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
                          variant="top"
                        />
                      </Link>
                      <Card.Body >
                        <Link to={`/product/${product._id}`}>
                          <Card.Title as="div">
                            <strong>{product.name}</strong>
                          </Card.Title>
                        </Link>

                        <Row>
                          <Button
                            variant="outline-danger"
                            to={`/info/${product._id}`}
                            class="btn btn-info"
                            style={{
                              padding: '0px',
                              positionAlign: 'center'
                            }}
                            onClick={() => deleteHandler(product._id)}
                          >
                            Delete
                          </Button>
                        </Row>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
                
            </div>
          </div>
        )}
        {activeLayer === 2 && (
          <div style={{ backgroundColor: 'lightgray', padding: '20px', marginTop: '10px',  borderRadius: '10px', textAlign: 'center' }}>
            <h2 style={{color:'white',  fontWeight: 'bold', textDecoration: 'underline'}}>Statistic   </h2>
            <p>This is the content of Card Layer 2.</p>
          </div>
        )}
      </div>
        </div>
     }
      
      </div>
      
  
  );
};

export default AdminInfoScreen;
