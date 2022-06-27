import React, { useState, useEffect } from 'react';
import './Login.css';
import { auth, provider } from './firebase';
import { actionTypes } from './reducer';
import { useStateValue } from './StateProvider';
import { Button } from '@mui/material';
import db from './firebase';

function Login() {
  const [{}, dispatch] = useStateValue();
  const [users, setUsers] = useState();
  const [seed, setSeed] = useState(null);

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, []);

  useEffect(() => {
    db.collection('users').onSnapshot((snapshot) => {
      setUsers(snapshot.docs.map((doc) => doc.data()));
    });
  }, []);

  const signIn = () => {
    auth
      .signInWithPopup(provider)
      .then((result) => {
        dispatch({
          type: actionTypes.SET_USER,
          user: result.user,
        });
        const username = users.map((user) => {
          return user.username;
        });

        if (!username.includes(result.user.displayName)) {
          db.collection('users').add({
            username: result.user.displayName,
            photoUrl: result.user.photoURL,
          });
        }
      })
      .catch((error) => alert(error.message));
  };

  return (
    <div className='login'>
      <div className='login__container'>
        <img
          src={`https://avatars.dicebear.com/api/croodles/${seed}.png`}
          alt=''
        />
        <div className='login_text'>
          <h1>Sign in to Application</h1>
        </div>
        <Button type='submit' onClick={signIn}>
          Sign in With Google
        </Button>
      </div>
    </div>
  );
}

export default Login;
