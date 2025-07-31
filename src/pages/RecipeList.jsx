import React from 'react';
import {useNavigate} from 'react-router-dom';
//import {RECIPES} from '../data.js';
import {Link} from 'react-router-dom';
//import Layout from './Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faSliders, faEdit } from '@fortawesome/free-solid-svg-icons';
import {useState} from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'


export default function RecipeListApp({recipes, setRecipes}){
    return <div className="recipelist-body"><RecipeList recipes={recipes} setRecipes={setRecipes} /></div>
}

function ListItems({recipes, onDelete}){
    
    return(
        
        <div className="card shadow m-4 py-3 col-md-3 respon">
            <img src={`${recipes.pic || "/images/recipe1.jpg"}`} loading='lazy' width="" height="" alt={recipes.name} className="img img-fluid imgg  mx-auto d-block" />
            <div className="d-flex justify-content-between m-2">
              <h5 className="text-uppercase">{recipes.name}</h5>
              <h5 className='badge text-dark fs-5 text-capitalize px-2'>{recipes.category}</h5>
            </div>
            <small className='text-muted fs-6 fw-light'>{recipes.instructions.slice(0, 3)}...</small>
            <div className="d-flex justify-content-between m-2">
                 <Link to={`/recipeDetails/${recipes.id}`} rel="noopener noreferrer" className="btn p-2 bg-warning text-white" >View the full recipe</Link>
                 <Link to={`/editRecipe/${recipes.id}`} rel="noopener noreferrer" className="btn p-2  text-warning" ><FontAwesomeIcon icon={faEdit} /></Link>
            </div>
            <button onClick={() => onDelete(recipes.id)} className="btn text-warning"><FontAwesomeIcon icon={faTrash} />
</button>
            
        </div>
        
    );
}

function List({filteredRecipes, onDelete}){
    
    return (
        <div>
            {filteredRecipes.length > 0 && (
                <div className="row justify-content-center">
                {filteredRecipes.map((recipe) => (
                    <ListItems key={recipe.id} recipes={recipe} onDelete={onDelete} />
                ))}
                
                </div>
            )}
        </div>
    );

}

function SearchBar({filterText, onFilterTextChange, onHandleCat}){

    return(
        
        <div>
        <form className="d-flex align-items-center justify-content-center my-2">
            <input type="text" value={filterText} placeholder="Search for recipes..." className="p-2 inputt"
            onChange={(e) => onFilterTextChange(e.target.value)} />
             <div className="dropdown">
                <button className="btn" onClick={(e) => e.preventDefault()}>
                    <FontAwesomeIcon className='text-warning fw-bold' icon={faSliders} />
                </button>
                <div className="dropdown-menuu">
                    <ul className="list-unstyled p-3">
                        <li className='dropdown-itemm'><a className="text-dark text-decoration-none fw-bold" href="#" onClick={() => onHandleCat('all')} >All</a></li>
                        <li className='dropdown-itemm'><a className="text-dark text-decoration-none fw-bold" href="#" onClick={() => onHandleCat('breakfast')}>Breakfast</a></li>
                        <li className='dropdown-itemm'><a className="text-dark text-decoration-none fw-bold" href="#" onClick={() => onHandleCat('lunch')}>Lunch</a></li>
                        <li className='dropdown-itemm'><a className="text-dark text-decoration-none fw-bold" href="#" onClick={() => onHandleCat('dinner')}>Dinner</a></li>
                        <li className='dropdown-itemm'><a className="text-dark text-decoration-none fw-bold" href="#" onClick={() => onHandleCat('snacks')}>Snacks</a></li>
                        <li className='dropdown-itemm'><a className="text-dark text-decoration-none fw-bold" href="#" onClick={() => onHandleCat('dessert')}>Dessert</a></li>
                    </ul>
                </div>
             </div>
        </form>
        </div>

    );

}

function RecipeList({recipes, setRecipes}){

    const [filterText, setFilterText] = useState('');
    const [category, setCategory] = useState('all');

    const navigate = useNavigate();

    function handleCategoryClick(newCat){
        setCategory(newCat);
    }

    const handleDelete = (recipeId) => {

        const confirmDelete = window.confirm(`Are you sure you want to delete this recipe?`);

        if (confirmDelete){
            const updatedRecipes = recipes.filter((recipe) => recipe.id !== recipeId);
        setRecipes(updatedRecipes);
        toast.success("Recipe deleted successfully!");
        } else if (!confirmDelete)
            {
        toast.warning("Recipe deletion cancelled!");
        }
      };

    const handleEdit = (recipe) => {
        navigate(`/editRecipe/${recipe.id}`);
        
    }  


    const filteredRecipes = recipes.filter((recipe) => {
        const catMatch = category === 'all' || recipe.category === category;
        const nameMatches = recipe.name.trim().toUpperCase().includes(filterText.trim().toUpperCase());
        return catMatch && nameMatches;
    });

    if (filteredRecipes.length === 0) {

        return(
            <>
            {/*<Layout />*/}
            <h1 className='text-center mt-3'>RECIPE LIST</h1>
            <SearchBar filterText={filterText} onFilterTextChange={setFilterText} onHandleCat={handleCategoryClick} />
            <h2 className="mt-3 mx-5 px-5 text-capitalize">CATEGORY: <i className="text-warning fw-bold">{category}</i></h2>
            <p className="mx-5 px-5 fw-bold text-warning">Number of recipes: <i>{filteredRecipes.length}</i></p>
            <p className="text-center fw-bold">Sorry, it appears that the recipe you searched for doesn't exist in this category or does not exist at all. Try searching for another.</p>
            </>
        );
    }

    return(
        <>
        {/*<Layout />*/}
        <h1 className='text-center mt-3'>RECIPE LIST</h1>
        <SearchBar filterText={filterText} onFilterTextChange={setFilterText} onHandleCat={handleCategoryClick} />
        <h4 className="mt-3 mx-5 px-5">CATEGORY: <i className="text-warning fw-bold text-capitalize">{category}</i></h4>
        <p className="mx-5 px-5">Number of recipes: <i className='text-warning'>{filteredRecipes.length}</i></p>
        <List recipes={recipes} onDelete={handleDelete} onEdit={handleEdit} filterText={filterText} filteredRecipes={filteredRecipes} />
        <ToastContainer position="top-right" autoClose={3000} />
        </>
    );

}