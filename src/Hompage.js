import React from 'react';
import './Homepage.css';
import { GitHub, LinkedIn } from '@mui/icons-material';

function Homepage() {
  return (
    <div className='hompage'>
      <div className='hompage__container'>
        <img
          src='https://theme.zdassets.com/theme_assets/11534279/64c64fc11e057ac12472f4699df4c4c570b7f995.png'
          alt=''
        />
        <img
          src='https://www.lotusbiscoff.com/sites/default/files/styles/image_style_16_10_landscape_sm/public/p001/2020-05/Biscoff%20US%20Craving%20Cup2.jpg?h=b044a8f9&itok=aJxYEgjb'
          alt=''
        />
        <div className='hompage__text'>
          <h1>Welcome to Biscoff!</h1>
          <h2>Dive into rooms or create one!</h2>
          <a href='https://github.com/92chuck/Biscoff' target='blank'>
            <GitHub sx={{ fontSize: 50, padding: 3 }} />
          </a>
          <a href='https://www.linkedin.com/in/junbeomchun' target='blank'>
            <LinkedIn sx={{ fontSize: 50, padding: 3 }} />
          </a>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
