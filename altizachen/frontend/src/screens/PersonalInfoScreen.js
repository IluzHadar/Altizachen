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

function PersonalInfoScreen() {
  const navigate = useNavigate();
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

  const PauseHandler = async (e) => {
    console.log('PAUSEEEEEEEE_Handler');
    products.pauseAd = true;
    const { data4 } = await axios.put(
      `/api/products/${products._id}`,
      products
    );
    console.log('123!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    navigate('/');
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure to delete?')) {
      console.log('DELETEEEEEEEEEEEEEEEEEEE');
      try {
        await axios.delete(`/api/products/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        //toast.success('product deleted successfully');
        dispatch({ type: 'DELETE_SUCCESS' });
      } catch (err) {
        console.log(err);
        dispatch({
          type: 'DELETE_FAIL',
        });
      }
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      console.log('PAUSEEEEEEEE');
      products.pauseAd = true;
      const { data2 } = await axios.put(
        `/api/products/${products._id}`,
        products
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div class="card-body">
      <h1 style={{ fontWeight: 'bold', textAlign: 'center' }}>Personal Info</h1>

      <Card className="w-100 h-80 my-3 p-3 rounded text-center">
        <Card.Body>
          <h7>
            Hello, {user.name}
            <div>Phone number: {user.numberPhone}</div>
            <div>Email : {user.email}</div>
          </h7>
        </Card.Body>
      </Card>

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
                <Card.Body onSubmit={submitHandler}>
                  <Link to={`/product/${product._id}`}>
                    <Card.Title as="div">
                      <strong>{product.name}</strong>
                    </Card.Title>
                  </Link>

                  <Row>
                    <Link
                      type="button"
                      variant="outline-success"
                      to={`/EditProduct/${product._id}`}
                      class="btn btn-info"
                      style={{
                        width: '64px',
                        padding: '0px',
                        color: 'green',
                      }}
                    >
                      Edit
                    </Link>
                    <Button
                      variant="outline-danger"
                      to={`/info/${product._id}`}
                      class="btn btn-info"
                      style={{
                        width: '64px',
                        padding: '0px',
                      }}
                      onClick={() => deleteHandler(product._id)}
                    >
                      Delete
                    </Button>{' '}
                    <Button
                      variant="outline-warning"
                      to={`/info/${product._id}`}
                      class="btn btn-info"
                      style={{
                        color: 'black',
                        width: '64px',
                        padding: '0px',
                      }}
                      value={true}
                      onClick={(e) => PauseHandler(e.target.value)}
                    >
                      Pause
                    </Button>{' '}
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