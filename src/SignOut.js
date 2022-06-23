import React from 'react';
import { auth, provider } from './firebase';
import { actionTypes } from './reducer';
import { useStateValue } from './StateProvider';
import LogoutIcon from '@mui/icons-material/Logout';

function SignOut() {
  const [{ user }, dispatch] = useStateValue();
  const signOut = () => {
    auth
      .signOut()
      .then((result) => {
        dispatch({
          type: actionTypes.SET_USER,
          user: null,
        });
        alert('You are successfully logged-out');
      })
      .catch((error) => alert(error.message));
  };
  return (
    <div>
      <LogoutIcon onClick={signOut} />
    </div>
  );
}

export default SignOut;
