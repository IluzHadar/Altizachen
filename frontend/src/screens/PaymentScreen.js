import { Store } from '../Store';
import Axios from 'axios';
import { useContext, useEffect } from 'react';
import { createContext, useReducer, state } from 'react';

export default function PaymentScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);

  useEffect(() => {
    ctxDispatch({ type: 'CART_CLEAR' });
    ctxDispatch({ type: 'CART_REMOVE_ITEM' });
  }, []);

  return (
    <div>
      <h1>Payment confirmed</h1>
    </div>
  );
}
