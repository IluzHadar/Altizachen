import { useEffect, useContext, useReducer, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import logger from 'use-reducer-logger';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { Store } from '../Store';

import { useJsApiLoader } from '@react-google-maps/api'

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, products: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, erroe: action.payload };
    case 'FETCH_REQUEST2':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS2':
      return { ...state, users: action.payload, loading: false };
    case 'FETCH_FAIL2':
      return { ...state, loading: false, erroe: action.payload };
    default:
      return state;
  }
};

function MainScreen() {
  const { state } = useContext(Store);
  const { user } = state;
  const [{ products }, dispatch] = useReducer(logger(reducer), {
    products: [],
    loading: true,
    error: '',
  });

  const [section, setSection] = useState(true)

  const [{ users }, dispatch2] = useReducer(logger(reducer), {
    users: [],
    loading: true,
    error: '',
  });

  const [sortedProducts, setSortedProducts] = useState([]);
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyBB5c0WLGH8nTZEZO06ThVwmNdK5KWSfyQ',
    libraries: ['places'],
  });

  const [origin, setOrigin] = useState({ lat: null, lng: null });

  // For user location

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  function successCallback(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    setOrigin({ lat: latitude, lng: longitude });

    // Use the latitude and longitude values as needed
  }

  function errorCallback(error) {
    console.error('Error getting location:', error.message);
  }
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

  useEffect(() => {
    const fetchData = async () => {
      dispatch2({ type: 'FETCH_REQUEST2' });
      try {
        const result = await axios.get('/api/users');
        dispatch2({ type: 'FETCH_SUCCESS2', payload: result.data });
      } catch (err) {
        dispatch2({ type: 'FETCH_FAIL2', payload: err.message });
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const calculateRoutes = async () => {
      const google = window.google;
      const directionsService = new google.maps.DirectionsService();
      // iterate through all products and calculate distance and assign
      // to each product
      const productsWithDistance = await Promise.all(
        products.map(async (product) => {
          if (!product.location) {
            const distance = 0;
            return { ...product, distance };
          }
          const directions = await directionsService.route({
            origin: origin,
            destination: product.location,
            travelMode: google.maps.TravelMode.DRIVING,
          });
          const distance = directions.routes[0].legs[0].distance.value;
          return { ...product, distance };
        })
      );
      // sort products by distance
      const sortedProducts = productsWithDistance.sort(
        (a, b) => a.distance - b.distance
      );
      setSortedProducts(sortedProducts);
    };
    if (origin && products.length > 0 && isLoaded) {
      calculateRoutes();
    }
  }, [origin, products, isLoaded]);

  if (sortedProducts.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        textAlign: 'center',
        border: '1px solid #ccc',
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#fff',
      }}
    >
      <div
        style={{
          backgroundColor: '#c3ccd5',
          padding: '0.75rem',
          borderBottom: '1px solid #dee2e6',
          borderRadius: '0.25rem 0.25rem 0 0',
          textAlign: 'center',
          fontWeight: 'bold',
        }}
      >
        <ul class='nav nav-tabs card-header-tabs'>
          <li class='nav-item'>
            <button
              style={{
                border: 'none',
                cursor: 'pointer',
                backgroundColor: section ? 'white' : '#c3ccd5',
              }}
              class={section ? 'nav-link active' : 'nav-link text-muted'}
              onClick={() => {
                console.log('main')
                setSection(true)
              }}
            >
              All Active Ads
            </button>
          </li>
          <div>
            <br></br>
          </div>
          <li class='nav-item' style={{ padding: ' 0 0 0 10px' }}>
            {user && user.userRating >= 10 /*60%*/ && (
              <button
                class={!section ? 'nav-link active' : 'nav-link text-muted'}
                style={{
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: !section ? 'white' : '#c3ccd5',
                }}
                onClick={() => {
                  setSection(false)
                }}
              >
                VIP Ads
              </button>
            )}
          </li>
        </ul>
      </div>

      {section === true ? (
        <div class='mainScreen'>
          <h7>
            --- All ads are sorted by distance from your current location,
            displayed from closest to farthest location. ---
          </h7>
          <div class='card-body'>
            <div id='carouselExample' class='carousel slide'>
              <div class='carousel-inner'>
                <div class='carousel-item active'>
                  <div>
                    <div className='products'>
                      {sortedProducts
                        .filter((products) => products.pauseAd === false)
                        .map((product) => (
                          <Col
                            className='align-items-stretch d-flex'
                            key={product._id}
                            sm={12}
                            md={6}
                            lg={4}
                            xl={3}
                            style={{ padding: '20px' }}
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
                                <Card.Title style={{ fontWeight: 'bold' }}>
                                  {product.name}
                                </Card.Title>
                                <Link
                                  to={`/product/${product._id}`}
                                  type='button'
                                  class='btn btn-info'
                                  style={{ color: 'white', width: '120px' }}
                                >
                                  <strong>Enter Ad</strong>
                                </Link>
                              </Card.Body>
                            </Card>
                          </Col>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button
              class='carousel-control-prev'
              type='button'
              data-bs-target='#carouselExample'
              data-bs-slide='prev'
            >
              <span
                class='carousel-control-prev-icon'
                aria-hidden='true'
              ></span>
              <span class='visually-hidden'>Previous</span>
            </button>
            <button
              class='carousel-control-next'
              type='button'
              data-bs-target='#carouselExample'
              data-bs-slide='next'
            >
              <span
                class='carousel-control-next-icon'
                aria-hidden='true'
              ></span>
              <span class='visually-hidden'>Next</span>
            </button>
          </div>
        </div>
      ) : (
        <div class='vipAds'>
          <h7>
            --- VIP ads are sorted by distance from your current location,
            displayed from closest to farthest location. ---
          </h7>
          <div class='card-body'>
            <div id='carouselExample' class='carousel slide'>
              <div class='carousel-inner'>
                <div class='carousel-item active'>
                  <div>
                    <div className='products'>
                      {/* not paused AD and less than 1 day creation */}
                      {sortedProducts
                        .filter(
                          (products) =>
                            products.pauseAd === false &&
                            new Date(products.createdAt) >=
                              new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
                        )

                        .map((product) => (
                          <Col
                            className='align-items-stretch d-flex'
                            key={product._id}
                            sm={12}
                            md={6}
                            lg={4}
                            xl={3}
                            style={{ padding: '20px' }}
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
                                <Card.Title style={{ fontWeight: 'bold' }}>
                                  {product.name}
                                </Card.Title>
                                <Link
                                  to={`/product/${product._id}`}
                                  type='button'
                                  class='btn btn-info'
                                  style={{ color: 'white', width: '120px' }}
                                >
                                  <strong>Enter Ad</strong>
                                </Link>
                              </Card.Body>
                            </Card>
                          </Col>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button
              class='carousel-control-prev'
              type='button'
              data-bs-target='#carouselExample'
              data-bs-slide='prev'
            >
              <span
                class='carousel-control-prev-icon'
                aria-hidden='true'
              ></span>
              <span class='visually-hidden'>Previous</span>
            </button>
            <button
              class='carousel-control-next'
              type='button'
              data-bs-target='#carouselExample'
              data-bs-slide='next'
            >
              <span
                class='carousel-control-next-icon'
                aria-hidden='true'
              ></span>
              <span class='visually-hidden'>Next</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainScreen;
