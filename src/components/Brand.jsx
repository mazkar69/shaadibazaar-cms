import React from 'react';
import { Link } from 'react-router';
import { Stack } from 'rsuite';

const Brand = props => {
  return (
    <Stack className="brand" {...props} spacing={5}>
      {/* <img height={26} style={{ marginTop: 6 }} /> */}
      <img src={'/logo/logo.png'} alt='shaadibazaar' className='logo' style={{width:"35px",height:"35px",borderRadius:"50%"}}/>

      <Link to={"/"}>
        <h3 style={{color:"red", fontSize:"1.3rem"}}>SHAADI BAZAAR</h3>
      </Link>
    
    </Stack>
  );
};

export default Brand;
