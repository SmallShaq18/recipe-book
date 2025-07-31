import React from 'react';
import {Link} from 'react-router-dom';
import Layout from './Layout'

export default function HomePage(){

    return (
        <>
        {/*<Layout />*/}
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