import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
//import './App.css'; // new CSS file for styling

export default function HomePage({ darkMode }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div className={`hero-wrapper d-flex justify-content-center align-items-center text-center ${darkMode ? 'dark' : ''}`}>
      <div className={`hero-content p-4 rounded-4 shadow-lg bg-white ${loaded ? 'animate' : ''}`}>
        <h1 className="mb-3 fw-bold text-warning-emphasis animated-text">🍳 Welcome to Shaq’s Recipe Book!</h1>
        <h5 className="mb-4 text-secondary">
          Your culinary companion on a journey of delightful and delicious recipes!
        </h5>
        <p className="mb-4 text-muted">
          Explore a world of diverse cuisines, savour mouthwatering delicacies, and bring the joy of cooking into your home.
          Let’s embark on a culinary adventure together!
        </p>
        <Link to="/recipeList" className="btn btn-warning px-4 py-2 fw-semibold shadow-sm">
          Start Cooking →
        </Link>
      </div>
    </div>
  );
}


/*import React from 'react';
import {Link} from 'react-router-dom';
import Layout from './Layout'

export default function HomePage(){

    return (
        <>
        <div className="d-flex justify-content-center align-items-center">
            <div className="p-5">
             <h1>Welcome To Shaq's Recipe Book App Home Page!</h1>
             <h5>Your culinary companion on a journey of delightful and delicious recipes!</h5>
             <p>Explore a world of diverse cuisines, savour mouthwatering delicacies, and bring the joy of cooking into your home. Let's embark on a culinary adventure together!</p>
             <p>Click below to get started!</p>
             <button className="btn bg-warning"><Link to="/recipeList" className="text-white text-decoration-none fw-bold">GO TO RECIPE LIST</Link></button>
            </div>
        </div>
        </>
    );

}
*/