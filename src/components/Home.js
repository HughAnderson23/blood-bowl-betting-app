import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h1>Welcome to the Blood Bowl Betting App</h1>
      <p>Register or log in to start betting!</p>
      <div>
        <Link to="/login" style={{ marginRight: 10 }}>Login</Link>
        <Link to="/register">Register</Link>
      </div>
    </div>
  );
};

export default Home;
