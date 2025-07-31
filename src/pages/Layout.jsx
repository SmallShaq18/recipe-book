import React from 'react';
import {Outlet, Link} from 'react-router-dom';

export default function Layout({toggleDarkMode, darkMode}){

    return (
        <div>
            <div className="row bg-danger p-2 header-row">
                <div className="col-sm-6">
                    <button onClick={toggleDarkMode} className="btn btn-sm btn-outline-light ms-2">
                     {darkMode ? '☀️' : '🌙'}
                    </button>
                </div>
            <div className="col-sm-6 positiion-absolute navv">
            <nav>
                <ul className='d-flex justify-content-between list-unstyled text-decoration-none px-5'>
                    <li><Link to="/" className="text-white text-decoration-none fw-bold">HOME</Link></li>
                    <li><Link to="/recipeList" className="text-white text-decoration-none fw-bold">RECIPES</Link></li>
                    <li><Link to="/addNew" className="text-white text-decoration-none fw-bold">ADD NEW</Link></li>
                </ul>
            </nav>
                </div>
            </div>
        <Outlet />
        </div>
    );
}       