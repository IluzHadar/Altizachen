import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import bcrypt from 'bcryptjs';


const CreateUserScreen = () => {
  const { state } = useContext(Store);
  const { user } = state;
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setpassword] = useState('');
  const [numberPhone, setnumberPhone] = useState('');
  const [uploading, setUploading] = useState(false);  
  const [errorMsg, setErrorMsg] = useState(null);




  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const user = { name, email, password, numberPhone};
      if (!name || !email || !password || !numberPhone) {
        setErrorMsg('Enter All Fields');
      }

      user.password = bcrypt.hashSync(password);
      user.sumOfLike = 0;
      user.userRating = 0;
      user.userAdCounter = 0;
      const { data } = await axios.post(`/api/users`, { user });
      navigate('/login');
    } catch (error) {
      console.log(error);
      setErrorMsg(error.response.data.message);
    }
  };

  

  return (

    <React.Fragment>
      {errorMsg && <MessageBox variant='danger'>{errorMsg}</MessageBox>}
      <Form onSubmit={submitHandler}>
      <h1 style={{fontWeight: 'bold'}}>Create User Page</h1>
      <br></br>
        <Form.Group className='mt-2' controlId='name'>
          <Form.Label>Name:</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <br></br>
        <Form.Group className='mt-2' controlId='email'>
          <Form.Label>Email:</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <br></br>
        <Form.Group className='mt-2' controlId='numberPhone'>
          <Form.Label>Number phone:</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter number phone:'
            value={numberPhone}
            onChange={(e) => setnumberPhone(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <br></br>
        <Form.Group className='mt-2' controlId='Password'>
          <Form.Label>Password:</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter password'
            value={password}
            onChange={(e) => setpassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <br></br>
        <Button className='mt-3' type='submit' variant='success'>
          Create User
        </Button>
      </Form>
    </React.Fragment>
  );
};

export default CreateUserScreen;

//bcrypt.hashSync(password)