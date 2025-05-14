import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

function PatientNav() {
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState(null);
    const [showSettingsMenu, setShowSettingsMenu] = useState(false);

    useEffect(() => {
        const role = localStorage.getItem('userRole');
        setUserRole(role);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
        navigate('/login');
    };

    const toggleSettingsMenu = () => {
        setShowSettingsMenu(!showSettingsMenu);
    };

    const styles = {
        sidebarLayout: {
            position: 'fixed',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            width: 'auto',
            backgroundColor: '#2C3E50',
            justifyContent: 'start',
            top: 75,
            left: 0,
            padding: '2em',
            borderRight: '4px solid black',
            color: 'white',
        },
        sidebarContainer: {
            alignItems: 'start',
            fontFamily: 'Poppins',
        },
        sidebarList: {
            listStyle: 'none',
            padding: 0,
        },
        sidebarListItem: {
            marginBottom: '10px',
            cursor: 'pointer',
            padding: '10px',
            borderRadius: '5px',
            transition: 'background-color 0.3s',
            position: 'relative',
        },
        settingsMenu: {
            position: 'absolute',
            top: '100%',
            left: 0,
            backgroundColor: '#34495E',
            borderRadius: '5px',
            padding: '10px',
            minWidth: '150px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            zIndex: 100,
        },
        menuItem: {
            padding: '8px 12px',
            borderRadius: '3px',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            '&:hover': {
                backgroundColor: '#2C3E50',
            }
        }
    };

    return (
        <nav style={styles.sidebarLayout}>
            <div>
                <h2>DASHBOARD</h2>
            </div>

            <div style={styles.sidebarContainer}>
                <ul style={styles.sidebarList}>
                    <li 
                        style={styles.sidebarListItem} 
                        onClick={toggleSettingsMenu}
                    >
                        Settings
                        {showSettingsMenu && (
                            <div style={styles.settingsMenu}>
                                <div 
                                    style={styles.menuItem}
                                    onClick={handleLogout}
                                >
                                    Logout
                                </div>
                            </div>
                        )}
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default PatientNav;