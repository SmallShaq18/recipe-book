import {Route, Routes} from 'react-router-dom';
import Layout from './pages/Layout.jsx';
import Home from './pages/HomePage.jsx';
import RecipeListApp from './pages/RecipeList.jsx';
import EditRecipe from './pages/EditRecipe.jsx';
import RecipeDetails from './pages/RecipeDetails.jsx';
import AddNewRecipe from './pages/AddNewRecipe.jsx';
import NoPage from './pages/NoPage.jsx';
import './App.css';
import {RECIPES} from './data.js';
import {useState, useEffect} from 'react';
;
//mport { FontAwesomeIcon } from '@fortawesome/react-fontawesome';<Route path="/newRecipeList" element={< NewRecipeList />} />

export default function App() {

  const storedRecipes = JSON.parse(localStorage.getItem('recipes')) || RECIPES || [];

  const initializeRecipes = () => {
  const source = storedRecipes || RECIPES || [];
  return source.map(recipe => ({
    ...recipe,
    id: recipe.id?.toString().includes('-') ? recipe.id : `${Date.now()}-${Math.random()}` // Patch numeric or duplicate IDs
  }));
};

  const [recipes, setRecipes] = useState(initializeRecipes);
  

  useEffect(() => {
    //update localStorage whenever RECIPES change
    localStorage.setItem('recipes', JSON.stringify(recipes));
  }, [recipes]);

  

  const [darkMode, setDarkMode] = useState(() => {
  return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);



  return (
    <div className={darkMode ? "bg-dark text-light min-vh-100" : "bg-light text-dark min-vh-100"}>
    <Routes>
      <Route path="/" element={<Layout toggleDarkMode={toggleDarkMode} darkMode={darkMode} />}>
        <Route index element={<Home darkMode={darkMode} />} />
        <Route path="recipeList" element={<RecipeListApp recipes={recipes} setRecipes={setRecipes} />} />
        <Route path="recipeDetails/:recipeId" element={<RecipeDetails recipes={recipes}  />} />
        <Route path="addNew" element={<AddNewRecipe recipes={recipes} setRecipes={setRecipes} />} />
        <Route path="editRecipe/:recipeId" element={<EditRecipe recipes={recipes} setRecipes={setRecipes} />} />
        <Route path="*" element={<NoPage />} />
      </Route>
    </Routes>
    </div>
  );
}

