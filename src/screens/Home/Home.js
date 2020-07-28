import React from 'react';
import { Link } from '@reach/router';

function Home() {
  return (
    <div>
      <h1>Home Page</h1>
      <Link to='/signup'>
        <p>Signup</p>
      </Link>
      <Link to='/login'>
        <p>Login</p>
      </Link>
      <Link to='/dashboard'>
        <p>Dashboard</p>
      </Link>
    </div>
  );
}

export default Home;
