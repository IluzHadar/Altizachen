import React, { useState, useEffect, useContext } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import { Store } from '../Store';
import axios from 'axios';
import MessageBox from '../components/MessageBox';

const LoginScreen = () => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { user } = state;
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [navigate, user]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/users/login', {
        email,
        password,
      });
      ctxDispatch({ type: 'LOGIN', payload: data });
      navigate('/');
    } catch (error) {
      setErrorMsg(error.response.data.message);
    }
  };

  return (
    <React.Fragment>
      <Container>
        {errorMsg && <MessageBox variant='danger'>{errorMsg}</MessageBox>}
        <Row className='justify-content-md-center'>
          <Col>
            <br></br>
            <h1>Sign In</h1>
            <br></br>

            <Form onSubmit={submitHandler}>
              <Form.Group className='input-group' controlId='email'>
                <Form.Label style={{padding:'10px',width: '150px' }}>Email Address: </Form.Label>
                <Col>
                <Form.Control
                  type='email'
                  placeholder='Enter email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{width: '250px'}}
                ></Form.Control>
                </Col>
              </Form.Group>
              <Form.Group className='input-group' controlId='password' style={{padding:'10px 0px 0px 0px '}}>
                <Form.Label style={{padding:'10px',width: '150px' }}>Password: </Form.Label>
                <Col>
                <Form.Control
                  type='password'
                  placeholder='Enter Password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{width: '250px'}}
                ></Form.Control>
                </Col>
              </Form.Group>
 
              <br></br>
              <Link to='/login/CreateUserScreen' className='nav-link'style={{fontWeight: 'bold', fontSize: '1.2rem', fontfamily:'Ariel'}}>
                Registration
              </Link>
              <br></br>

              <Button className='mt-3' type='submit' variant='success'>
                Sign In
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
};

export default LoginScreen;
