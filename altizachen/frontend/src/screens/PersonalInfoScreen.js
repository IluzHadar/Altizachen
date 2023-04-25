import { useEffect, useReducer } from 'react';
import { Store } from '../Store';
import { Link } from 'react-router-dom';
import axios from 'axios';
import logger from 'use-reducer-logger';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import React, { useState, useContext } from 'react';
import { Row } from 'react-bootstrap';

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

function PersonalInfoScreen() {
  const [{ products }, dispatch] = useReducer(logger(reducer), {
    products: [],
    loading: true,
    error: '',
  });
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

  return (
    <div class="card-body">
      <h1 style={{ fontWeight: 'bold', textAlign: 'center' }}>Personal Info</h1>

      <div className="products">
        {products
          .filter((products) => products.numberPhoneUser === user.numberPhone)
          .map((product) => (
            <Col
              className="align-items-stretch d-flex"
              key={product._id}
              sm={12}
              md={6}
              lg={4}
              xl={3}
              style={{ padding: '5px' }}
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
                <Card.Body>
                  <Link to={`/product/${product._id}`}>
                    <Card.Title as="div">
                      <strong>{product.name}</strong>
                    </Card.Title>
                  </Link>
                  <Row>
                    <Link
                      to={`/product/${product._id}`}
                      type="button"
                      class="btn btn-info"
                      style={{ color: 'white', width: '64px', padding: '0px' }}
                    >
                      <normal>Edite</normal>
                    </Link>

                    <Link
                      to={`/product/${product._id}`}
                      type="button"
                      class="btn btn-info"
                      style={{ color: 'white', width: '64px', padding: '0px' }}
                    >
                      <normal>Delete</normal>
                    </Link>

                    <Link
                      to={`/product/${product._id}`}
                      type="button"
                      class="btn btn-info"
                      style={{ color: 'white', width: '64px', padding: '0px' }}
                    >
                      <normal>Pause</normal>
                    </Link>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          ))}
      </div>
    </div>
  );
}

export default PersonalInfoScreen;
