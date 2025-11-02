import React from "react";
import { Link } from 'react-router-dom';

function NavBar({name}) {
    return (
        <nav className="border-b-2 flex text-center text-2xl items-center">
            <Link className="material-symbols-outlined m-2" to="/">arrow_back</Link>
            <p className="flex-1 justify-center">{name}</p>
        </nav>
    );
}

export default NavBar;
