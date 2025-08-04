//import React from 'react';
//import {RECIPES} from '../data.js';
import {useParams, Link} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faFire, faUtensils } from '@fortawesome/free-solid-svg-icons';
//import Layout from './Layout';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

export default function RecipeDetails({recipes}){
    return <div className="recipedeets-body"><Details recipes={recipes} /></div>
}

function DetailItems({recipes}){

    const {recipeId} = useParams();
    const recipe = recipes.find(recipe => recipe.id === (recipeId)); 
    console.log(recipe); 

    return(

    <div>
        <Link to="/recipeList" className="d-lg-none btn btn-outline-secondary btn-sm mb-3">
            ← Back to List
        </Link>
        <div className="row row-deets mb-5">
            <div className="col-md-4">
              <div>
                <img src={`${recipe.pic || "/images/recipe1.jpg"}`} alt={recipe.name} className="img img-fluid img-deets" />
              </div>
            </div>
            <div className="col-md-8 p-left text-dark">

                <div>
                  <h4 className="text-danger text-capitalize">{recipe.name}</h4>
                  <h6 className="text-capitalize" >{recipe.category}</h6>
                  <br />

                  <div className="row width">
                    <div className="col-3 col-md-2">
                        <h6>Prep Time</h6>
                        <FontAwesomeIcon icon={faClock} />{" "}
                        <i>{recipe.prep}</i>
                    </div>
                    <div className="col-3 col-md-2">
                        <h6>Cooking Time</h6>
                        <FontAwesomeIcon icon={faFire} />{" "}
                        <i>{recipe.cook}</i>
                    </div>
                    <div className="col-3 col-md-2">
                        <h6>No. of Servings</h6>
                        <FontAwesomeIcon icon={faUtensils} />{" "}  
                        <i>{recipe.servings}</i>
                    </div>
                  </div>
                  <br />

                  <h6 className="text-danger">Ingredients</h6>
                  <ul className="unordered">
                      {recipe.ingredients.map((ingredient, index) => (
                          <li key={`${recipe.id}_ingredient_${index}`}>{ingredient}</li>
                      ))}
                  </ul>
                  <h6 className="text-danger">Instructions</h6>
                  <ol className="unordered">
                      {recipe.instructions.map((instruction, index) => (
                          <li key={`${recipe.id}_instruction_${index}`}>{instruction}</li>
                      ))}
                  </ol>
                </div>

            </div>
        </div>
    </div>

    );
}

function DetailItemsList({recipes}){
    
    return(
        <div className="mt-4 container-fluid">
            <DetailItems recipes={recipes} />
        </div>
    );
}

function Details({recipes}){
    
    return(
        <div>
            {/*<Layout />*/}
            <h1 className='text-center mt-3'>RECIPE LIST</h1>
            <DetailItemsList recipes={recipes} />
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );

}