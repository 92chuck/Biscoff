import React, { useState, useEffect } from 'react';
import { auth, provider } from './firebase';
import { actionTypes } from './reducer';
import { useStateValue } from './StateProvider';
import LogoutIcon from '@mui/icons-material/Logout';
import db from './firebase';

function SignOut() {
  const [{ user }, dispatch] = useStateValue();
  const [users, setUsers] = useState();

  useEffect(() => {
    db.collection('users').onSnapshot((snapshot) => {
      setUsers(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });
  }, []);

  let currentUser = users?.filter((singleUser) => {
    return singleUser.data.username === user.displayName;
  });

  if (currentUser) {
    currentUser = currentUser[0];
  }

  const signOut = (id) => {
    auth.signOut().then((result) => {
      dispatch({
        type: actionTypes.SET_USER,
        user: null,
      });
      alert('You are successfully logged-out');
    });
    db.collection('users')
      .doc(id)
      .delete()
      .catch((error) => alert(error.message));
  };

  return (
    <div>
      <LogoutIcon onClick={() => signOut(currentUser.id)} />
    </div>
  );
}

export default SignOut;
