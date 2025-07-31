import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
//import {RECIPES} from '../data.js';
//import Layout from './Layout';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import {Link} from 'react-router-dom';

export default function AddNewRecipe({recipes, setRecipes}) {
    
    return(

        <div>
         {/*<Layout />*/}
         <AddNewForm recipes={recipes} setRecipes={setRecipes} />
        </div>

    );
}

function AddNewForm({recipes, setRecipes}) {

    const [nameVal, setNameVal] = useState('');
    const [categoryVal, setCategoryVal] = useState('breakfast');
    const [prepVal, setPrepVal] = useState('');
    const [cookVal, setCookVal] = useState('');
    const [servingsVal, setServingsVal] = useState('');
    const [picVal, setPicVal] = useState('');
    const [ingredientsVal, setIngredientsVal] = useState('');
    const [instructionsVal, setInstructionsVal] = useState('');

    const navigate = useNavigate();
    
      function handleAddRecipe(e){

        e.preventDefault();

        const ingredientsArr = Array.isArray(ingredientsVal) ? ingredientsVal : 
        ingredientsVal.split(/,|\n/).map((ingredient) => ingredient.trim())
        .filter((ingredient) => ingredient);
        
        const instructionsArr = Array.isArray(instructionsVal) ? instructionsVal : 
        instructionsVal.split(/,|\n/).map((instruction) => instruction.trim())
        .filter((instruction) => instruction);

        if (nameVal.trim() === "") {
        toast.error("Please fill in recipe name!");
        return;
        }

        if (ingredientsArr.length === 0 || instructionsArr.length === 0) {
        toast.warn("Tip: Add ingredients and instructions to complete your recipe later.");
        // Continue to add the recipe anyway
  }

          const newRecipe = {
            id: recipes.length + 1, name: nameVal, category: categoryVal, ingredients: ingredientsArr, 
            instructions: instructionsArr, pic: picVal, prep: prepVal, cook: cookVal, servings: servingsVal
          };

          setRecipes([...recipes, newRecipe]);
          toast.success("Recipe added successfully!");
          setTimeout(() => {
    navigate('/recipeList');
  }, 2000); // Wait 2s so toast can show
}
    
    return(

       <>
            <Link to="/recipeList" className="btn btn-outline-secondary btn-sm m-5"
                onClick={(e) => {
                e.preventDefault();
                toast.info("Returning to recipe list...");
                setTimeout(() => { navigate('/recipeList'); }, 1000); // 1 second delay for the toast to show
              }}>
                ← Back to List
            </Link>
       <div className="d-flex justify-content-center align-items-center">
            <form className="addnew-form">

                <h3 className="m-3">ADD NEW RECIPE HERE</h3>
                <h5 className="mx-3">Fill the form below to add a new recipe</h5>
                <h5 className="mt-4 text-danger">Recipe Category</h5>

                <div className="form-group row p-3">
                    <label className=" col-sm-3">Recipe Name:</label>
                    <div className="col-sm-9">
                        <input type="name" value={nameVal} className="form-control" id="name" placeholder="ex: coconut rice" 
                        onChange={(e) => setNameVal(e.target.value)} required />
                    </div>
                </div>
                <div className="form-group row p-3">
                    <label className=" col-sm-3">Dish Type:</label>
                    <div className="col-sm-9">
                        <select id="selectOption" name="selectOption" className="form-control" onChange={(e) => setCategoryVal(e.target.value)}>
                            <option value="breakfast">Breakfast</option>
                            <option value="lunch">Lunch</option>
                            <option value="dinner">Dinner</option>
                            <option value="snacks">Snacks</option>
                            <option value="dessert">Dessert</option>
                        </select>
                    </div>
                </div>

                <h5 className="mt-4 text-danger">🕒 Timing Info</h5>

                <div className="form-group row p-3">
                    <label className=" col-sm-3">Preparation Time:</label>
                    <div className="col-sm-9">
                        <input type="name" value={prepVal} className="form-control" id="prep-time" placeholder="e.g. 45 minutes"
                        onChange={(e) => setPrepVal(e.target.value)}  />
                    </div>
                </div>
                <div className="form-group row p-3">
                    <label className=" col-sm-3">Cooking Time:</label>
                    <div className="col-sm-9">
                        <input type="name" value={cookVal} className="form-control" id="cook-time" placeholder="e.g. 1 hour"
                        onChange={(e) => setCookVal(e.target.value)}  />
                    </div>
                </div>
                <div className="form-group row p-3">
                    <label className=" col-sm-3">No. of Servings:</label>
                    <div className="col-sm-9">
                        <input type="name" value={servingsVal} className="form-control" id="servings" placeholder="e.g. 4"
                        onChange={(e) => setServingsVal(e.target.value)}  />
                    </div>
                </div>

                <h5 className="mt-4 text-danger">📷 Image & Description</h5>

                <div className="form-group row p-3">
                    <label className=" col-sm-3">Recipe Image:</label>
                    <div className="col-sm-9">
                        <input type="name" value={picVal} className="form-control" id="pic" 
                        onChange={(e) => setPicVal(e.target.value)} placeholder="ex: https://pixaby.com/coconut-rice/" required />
                    </div>
                </div>
                <div className="form-group row p-3">
                    <label className=" col-sm-3">Ingredients(please use new lines to separate ingredients):</label>
                    <div className="col-sm-9">
                        <textarea value={ingredientsVal} placeholder="coconut, rice..." className="form-control" id="textareaInput1"
                        onChange={(e) => setIngredientsVal(e.target.value)}  name="textareaInput" rows="5"></textarea>
                    </div>
                </div>
                <div className="form-group row p-3">
                    <label className=" col-sm-3">Instructions(please use new lines to separate instructions):</label>
                    <div className="col-sm-9">
                       <textarea value={instructionsVal} placeholder="extract water from cocnut. wash the rice..." className="form-control" 
                       onChange={(e) => setInstructionsVal(e.target.value)} id="textareaInput2" name="textareaInput" rows="5"></textarea>
                    </div>
                </div>
                <button onClick={handleAddRecipe} type="submit" className="btn bg-danger text-white fw-bold my-3">Add Recipe</button>

            </form>
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
         </>
    );

}