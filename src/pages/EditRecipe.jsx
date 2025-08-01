import React, {useState} from 'react';
import {useParams, useNavigate, Link} from 'react-router-dom';
import { toast } from 'react-toastify';
//import {RECIPES} from '../data.js';
//import Layout from './Layout';

export default function EditRecipe({recipes, setRecipes}) {

    
    return(

        <div>
         {/*<Layout />*/}
         <EditRecipeForm recipes={recipes}  setRecipes={setRecipes} />
        </div>

    );
}

function EditRecipeForm({recipes, setRecipes}) {

    const {recipeId} = useParams();
    const recipesTE = recipes.find(recipe => recipe.id === parseInt(recipeId));

    const [nameVal, setNameVal] = useState(recipesTE.name);
    const [categoryVal, setCategoryVal] = useState(recipesTE.category);
    const [prepVal, setPrepVal] = useState(recipesTE.prep);
    const [cookVal, setCookVal] = useState(recipesTE.cook);
    const [servingsVal, setServingsVal] = useState(recipesTE.servings);
    const [picVal, setPicVal] = useState(recipesTE.pic);
    const [ingredientsVal, setIngredientsVal] = useState(recipesTE.ingredients);
    const [instructionsVal, setInstructionsVal] = useState(recipesTE.instructions);

    const navigate = useNavigate();
    
      function handleSaveEdit(e){

        e.preventDefault();

        const ingredientsArr = Array.isArray(ingredientsVal) ? ingredientsVal : 
        ingredientsVal.split(/,|\n/).map((ingredient) => ingredient.trim());
        
        const instructionsArr = Array.isArray(instructionsVal) ? instructionsVal : 
        instructionsVal.split(/,|\n/).map((instruction) => instruction.trim());
        
        if (nameVal.trim() !== "" &&  ingredientsArr.length > 0 && instructionsArr.length > 0 ) {

          const index = recipes.findIndex((recipe) => recipe.id === parseInt(recipeId));

          if (index !== -1){
            const updatedRecipe = [...recipes];
            updatedRecipe[index] = {
                ...updatedRecipe[index], name: nameVal, category: categoryVal, ingredients: ingredientsArr, 
                instructions: instructionsArr, pic: picVal, prep: prepVal, cook: cookVal, servings: servingsVal
            };

            setRecipes(updatedRecipe);
          }

        navigate('/recipeList');
        }
        toast.success("Recipe edited successfully!");
    
      }

      function onCancelEdit(){

        const confirmCancel = window.confirm(`All changes made will be discarded. Are you sure?`);
        if (confirmCancel) {
            navigate('/recipeList');
        }
      }

      const MAX_IMAGE_SIZE = 500 * 1024; // 500KB
const  handleImageUpload = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  if (file.size > MAX_IMAGE_SIZE) {
    alert("Image is too large. Please select one smaller than 500KB.");
    return;
  }

  const reader = new FileReader();
  reader.onloadend = () => {
    const base64String = reader.result;
    setPicVal(base64String); // this will update your `pic` field in JSON
  };
  reader.readAsDataURL(file);
};
    
    return(

        <>
        <Link to="/recipeList" className="btn btn-outline-secondary btn-sm mt-5 ms-2"
                onClick={(e) => {
                e.preventDefault();
                toast.info("Returning to recipe list...");
                setTimeout(() => { navigate('/recipeList'); }, 1000); // 1 second delay for the toast to show
              }}>
                ← Back to List
            </Link>
        <div className="d-flex justify-content-center align-items-center">
            <form className="addnew-form">

                <h3 className="m-3">EDIT RECIPE HERE</h3>
                <h5 className="mx-3">Fill the form below to edit the recipe</h5>
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
                <div className="form-group row p-3">
                    <label className=" col-sm-3">Preparation Time:</label>
                    <div className="col-sm-9">
                        <input type="name" value={prepVal} className="form-control" id="prep-time" placeholder="ex: 45 mins"
                        onChange={(e) => setPrepVal(e.target.value)}  />
                    </div>
                </div>
                <div className="form-group row p-3">
                    <label className=" col-sm-3">Cooking Time:</label>
                    <div className="col-sm-9">
                        <input type="name" value={cookVal} className="form-control" id="cook-time" placeholder="ex: 1 hour"
                        onChange={(e) => setCookVal(e.target.value)}  />
                    </div>
                </div>
                <div className="form-group row p-3">
                    <label className=" col-sm-3">No. of Servings:</label>
                    <div className="col-sm-9">
                        <input type="name" value={servingsVal} className="form-control" id="servings" placeholder="ex: 4"
                        onChange={(e) => setServingsVal(e.target.value)}  />
                    </div>
                </div>
                <div className="form-group row p-3">
                    <label className=" col-sm-3">Recipe Image:</label>
                    <div className="col-sm-9">
                        {picVal && (
  <div className="mb-3">
    <label className="form-label text-muted">(Current Picture)</label>
    <img src={picVal} alt="Recipe Preview" style={{ maxWidth: "100%", height: "auto", borderRadius: "8px" }} />
  </div>
)}
                        <input type="file" accept="image/*" className="form-control" id="pic" 
                        onChange={handleImageUpload} />
                    </div>
                </div>
                <div className="form-group row p-3">
                    <label className=" col-sm-3">Ingredients(please use new lines to separate ingredients):</label>
                    <div className="col-sm-9">
                        <textarea value={ingredientsVal} placeholder="coconut, rice..." className="form-control" id="textareaInput1"
                        onChange={(e) => setIngredientsVal(e.target.value)}  name="textareaInput" rows="5" required></textarea>
                    </div>
                </div>
                <div className="form-group row p-3">
                    <label className=" col-sm-3">Instructions(please use new lines to separate instructions):</label>
                    <div className="col-sm-9">
                       <textarea value={instructionsVal} placeholder="extract water from cocnut. wash the rice..." className="form-control" 
                       onChange={(e) => setInstructionsVal(e.target.value)} id="textareaInput2" name="textareaInput" rows="5" required></textarea>
                    </div>
                </div>
                <button onClick={handleSaveEdit} type="submit" className="btn bg-warning text-white fw-bold m-3">Save Changes</button>
                <button onClick={onCancelEdit} type="submit" className="btn bg-warning text-white fw-bold m-3">Cancel</button>

            </form>
        </div>
        </>
    );

}
/**/