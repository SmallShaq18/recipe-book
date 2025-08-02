import React from 'react';
import {Outlet, Link} from 'react-router-dom';

export default function Layout({toggleDarkMode, darkMode}){

    return (
        <div>
            <div className="row bg-danger px-3 header-row">
                {/*<div className="col-sm-6">
                    
                </div>
            <div className="col-sm-6 positiion-absolute navv">*/}
                
            <nav className='col-12 bg-danger pt-2'>
                
                <ul className='d-flex justify-content-between list-unstyled text-decoration-none px-5'>
                    <button onClick={toggleDarkMode} className="btn btn-sm btn-outline-light ms-2">
                     {darkMode ? '☀️' : '🌙'}
                    </button>
                    <li><Link to="/" className="text-white text-decoration-none fw-bold">HOME</Link></li>
                    <li><Link to="/recipeList" className="text-white text-decoration-none fw-bold">RECIPES</Link></li>
                    <li><Link to="/addNew" className="text-white text-decoration-none fw-bold">ADD NEW</Link></li>
                </ul>
            </nav>
                </div>
            
        <Outlet />
        </div>
    );
}       