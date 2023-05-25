import { useEffect, useReducer, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import logger from 'use-reducer-logger';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  DirectionsService,
  DirectionsRenderer,
} from '@react-google-maps/api';

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
    <div class="card text-center">
      <div class="card-header">
        <ul class="nav nav-tabs card-header-tabs">
          <li class="nav-item">
            <a class="nav-link active" href="#">
              Active
            </a>
          </li>

          <li class="nav-item">
            <a class="nav-link" href="#">
              Link
            </a>
          </li>

          <li class="nav-item">
            <a class="nav-link" href="#">
              Disabled
            </a>
          </li>
        </ul>
      </div>

      <div class="card-body">
        <div id="carouselExample" class="carousel slide">
          <div class="carousel-inner">
            <div class="carousel-item active">
              <div>
                <div className="products">
                  {sortedProducts
                    .filter((products) => products.pauseAd === false)
                    .map((product) => (
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
                          <Card.Body>
                            <Card.Title style={{ fontWeight: 'bold' }}>
                              {product.name}
                            </Card.Title>
                            <Link
                              to={`/product/${product._id}`}
                              type="button"
                              class="btn btn-info"
                              style={{ color: 'white', width: '120px' }}
                            >
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
        </div>
        <button
          class="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExample"
          data-bs-slide="prev"
        >
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button
          class="carousel-control-next"
          type="button"
          data-bs-target="#carouselExample"
          data-bs-slide="next"
        >
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
}

export default MainScreen;
