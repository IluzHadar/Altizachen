import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import { Navbar } from 'react-bootstrap';
import Badge from 'react-bootstrap/Badge';
import { NavDropdown } from 'react-bootstrap';

import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import { useContext } from 'react';
import { Store } from './Store';
import CartScreen from './screens/CartScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import PaymentScreen from './screens/PaymentScreen';
import LoginScreen from './screens/LoginScreen';
import UploadScreen from './screens/UploadScreen';

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, user } = state;

  const logoutHandler = () => {
    ctxDispatch({ type: 'LOGOUT' });
  };

  return (

       <BrowserRouter>
      <div className='a-flex flex-column site-container'>
        
        <header>
          <Navbar>
            <div class="row" style={{ backgroundImage: "url('/images/logo.png')", width:"1500px ",height: "350px" }}>
              <div class="col-md-auto" >
                  <Container > 
                  <Nav className='me-auto'>
                    {user && (
                      <Link to='/upload' className='nav-link'style={{padding: '155px 1px 10px 400px', fontWeight: 'bold', fontSize: '1.2rem', fontfamily:'Ariel'}}>
                        Upload Product
                      </Link>
                    )}
                  
                    {user? (
                    <Link to='/cart' className='nav-link' style={{padding: '155px 1px 10px 50px', fontWeight: 'bold', fontSize: '1.2rem' , fontfamily:'Ariel'}}>
                      Cart
                      {cart.cartItems.length > 0 && (
                        <Badge style={{ marginLeft: '5px' }} pill bg='danger'>
                          {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                        </Badge>
                      )}
                    </Link>
                    ):
                    ( //Matan: case if is not user, locate the 'cart' bottun 
                      <Link to='/cart' className='nav-link' style={{padding: '155px 100px 10px 400px', fontWeight: 'bold', fontSize: '1.2rem', fontfamily:'Ariel'}}>
                        Cart
                        {cart.cartItems.length > 0 && (
                          <Badge style={{ marginLeft: '5px' }} pill bg='danger'>
                            {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                          </Badge>
                        )}
                      </Link>
                      )}
                  </Nav>
    
                  </Container>
              </div>

              <div class="col-md-auto" >
                  <Nav className='ml-auto' style={{padding: '150px 1px 10px 600px', fontfamily:'Ariel',  fontWeight: 'bold', fontSize: '1.2rem'}}>
                    {user ? (
                      <NavDropdown title={user.name} id='username'>
                        <NavDropdown.Item onClick={logoutHandler}>
                          Logout
                        </NavDropdown.Item>
                      </NavDropdown>
                    ) : (
                      <LinkContainer to='/login' style={{padding: '5px 1px 10px 100px ', fontfamily:'Ariel',  fontWeight: 'bold', fontSize: '1.2rem'}}>
                        <Nav.Link>
                          <i className='fas fa-user' ></i> Sign In
                        </Nav.Link>
                      </LinkContainer>
                    )}
                  </Nav>
              </div>
            </div>
            
          </Navbar>          
        </header>
        <main>
          <div class="row" style={{padding: '0px 0px 0px 50px'}}>
            <div class="col col-lg-2" >

              <nav id="sidebarMenu" class="collapse d-lg-block sidebar collapse bg-white" >
                <div class="position-sticky" >
                <div class="list-group list-group-flush mx-3 mt-4">
                  <a  href='/'  class="list-group-item list-group-item-action py-2 ripple" aria-current="true">
                    <i class="fas fa-tachometer-alt fa-fw me-3"></i><span>Main page</span>  </a>
                  <a href="#" class="list-group-item list-group-item-action py-2 ripple active"> 
                    <i class="fas fa-chart-area fa-fw me-3"></i><span>Forniture</span>   </a>
                  <a href="#" class="list-group-item list-group-item-action py-2 ripple" >
                    <i class="fas fa-lock fa-fw me-3"></i><span>Electrical pwoer</span></a>
                  <a href="#" class="list-group-item list-group-item-action py-2 ripple"
                    ><i class="fas fa-chart-line fa-fw me-3"></i><span>Home producats</span></a>
                  <a href="#" class="list-group-item list-group-item-action py-2 ripple">
                    <i class="fas fa-chart-pie fa-fw me-3"></i><span>Gargen products</span> </a>
                  <a href="#" class="list-group-item list-group-item-action py-2 ripple" >
                    <i class="fas fa-chart-bar fa-fw me-3"></i><span>Car products</span></a>
                  <a href="#" class="list-group-item list-group-item-action py-2 ripple"
                    ><i class="fas fa-globe fa-fw me-3"></i><span>Animel products</span></a>
                  </div>
                </div>
              </nav>
              
            </div>
            <div class="col-md-auto">
              <Container className='mt-3' style={{padding: '0px 0px 0px 100px'}}>
                <Routes>
                  <Route path='/product/:id' element={<ProductScreen />} />
                  <Route path='/cart' element={<CartScreen />} />
                  <Route path='/upload' element={<UploadScreen />} />
                  <Route path='/login' element={<LoginScreen />} />
                  <Route path='/checkout' element={<CheckoutScreen />} />
                  <Route path='/PaymentScreen' element={<PaymentScreen />} />
                  <Route path='/' element={<HomeScreen />} />
                </Routes>
              </Container>
            </div>
          </div>
        </main>
        <footeer>
          <div className='text-center'>All rights reserved</div>
        </footeer>
       </div>
    </BrowserRouter>

       
      
  


   
  );
}

export default App;
