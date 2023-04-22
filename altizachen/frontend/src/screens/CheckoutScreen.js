import { useContext, useState } from 'react';
import { Store } from '../Store';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CheckoutScreen() {
  const [name, setName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [address, setAddress] = useState('');

  const navigate = useNavigate();
  const { state } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  function cc_format(value) {
    const v = value
      .replace(/\s+/g, '')
      .replace(/[^0-9]/gi, '')
      .substr(0, 16);
    const parts = [];

    for (let i = 0; i < v.length; i += 4) {
      parts.push(v.substr(i, 4));
    }

    return parts.length > 1 ? parts.join(' ') : value;
  }

  const checkoutHandler = async () => {
    await axios.put(`/api/products/updatecart`, { cartItems });
    navigate('/PaymentScreen');
  };

  return (
    <Container className='small-container'>
      <h1 className='my-3'>Checkout</h1>
      <Form>
        <Form.Group className='mb-3' controlId='name'>
          <Form.Label>Name: </Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter Name'
            value={name}
            onChange={(e) => {
              const updatedName = e.target.value.replace(/[0-9]/gi, '');
              setName(updatedName);
            }}
          ></Form.Control>
        </Form.Group>
        <Form.Group className='mb-3'>
          <Form.Label>Card Number:</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter Card Number'
            value={cc_format(cardNumber)}
            onChange={(e) => {
              const updatedCardNumber = e.target.value.replace(/[^0-9]/gi, '');
              setCardNumber(updatedCardNumber);
            }}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label>Address:</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter Address:'
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
            }}
          ></Form.Control>
        </Form.Group>
        <div className='mb-3'>
          <Button onClick={checkoutHandler}>Purchase</Button>
        </div>
      </Form>
    </Container>
  );
}
