import React, {useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import {AuthContext} from "../../context/AuthContext.jsx";
import './Header.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Header = () => {
    const {logout} = useContext(AuthContext);
    const navigate = useNavigate();

    const handleProfileClick = () => {
        navigate('/profile');
    };

    const handleLogout = () => {
        logout();
        navigate('/sign-in');
    };

    return (
        <header className="app-header">
            <div className="header-left">
                <h1 onClick={() => navigate('/artists')} style={{cursor: 'pointer'}}>
                    Nota
                </h1>
            </div>

            <div className="header-right">

                <AccountCircleIcon style={{color: 'white'}} onClick={handleProfileClick} className="profile-button"
                                   aria-label="Profile"/>

                <button onClick={handleLogout} className="logout-button">
                    Выйти
                </button>
            </div>
        </header>
    );
};

export default Header;