import React from 'react';
import './Homepage.css';

function Homepage() {
  return (
    <div className='hompage'>
      <div className='hompage__container'>
        <img
          src='https://theme.zdassets.com/theme_assets/11534279/64c64fc11e057ac12472f4699df4c4c570b7f995.png'
          alt=''
        />
        <div className='hompage__text'>
          <h1>Real-time Chat APP!</h1>
          <h2>REACT JS + FIREBASE</h2>
          <h3>Dive into the Rooms or Create One!</h3>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
