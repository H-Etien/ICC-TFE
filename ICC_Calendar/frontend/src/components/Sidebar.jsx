import React from "react";
import { Link } from "react-router-dom";

//import "./Sidebar.css";

function Sidebar() {
    return (
        <div className="sidebar">
            <ul>
                <li>
                    <Link to="/">Accueil</Link>
                </li>
                <li>
                    <Link to="/login">Connexion</Link>
                </li>
                <li>
                    <Link to="/tasks">Tâches</Link>
                </li>
                <li>
                    <Link to="/tags">Étiquettes</Link>
                </li>
                <li>
                    <Link to="/about">À propos</Link>
                </li>
                <li>
                    <Link to="/contact">Contact</Link>
                </li>
            </ul>
        </div>
    );
}

export default Sidebar;
