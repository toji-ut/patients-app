import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "../../assets/SCOPE logo.png"; 

function Login() {
    const styles = {
        root: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#2C3E50',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: 0,
            padding: 0,
            overflow: 'hidden',
        },
        loginLayout: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            width: '100%',
            height: '100%',
            padding: '2rem',
            boxSizing: 'border-box',
        },
        logoContainer: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '2rem',
        },
        logo: {
            width: '10rem',
            height: '10rem',
            borderRadius: '50%',
            marginBottom: '1rem',
        },
        title: {
            color: 'white',
            fontFamily: 'Poppins',
            fontSize: '2rem',
            fontWeight: 'bold',
        },
        userCredentials: {
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            padding: '2rem',
            width: '90%',
            maxWidth: '25rem',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        },
        formHeader: {
            marginBottom: '1.5rem',
            fontFamily: 'Poppins',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#2C3E50',
        },
        input: {
            width: '100%',
            marginBottom: '1rem',
            padding: '0.75rem',
            borderRadius: '0.3em',
            border: '1px solid #ddd',
            fontFamily: 'Poppins',
            fontSize: '1rem',
            boxSizing: 'border-box',
        },
        button: {
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#2980B9',
            color: 'white',
            fontFamily: 'Poppins',
            fontSize: '1rem',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '0.3em',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
            boxSizing: 'border-box',
        },
        buttonHover: {
            backgroundColor: '#3498DB',
        },
    };

    const [formData, setFormData] = useState({ username: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            if (data.token) {
                localStorage.setItem('token', data.token);

                if (data.user.role === 'patient') {
                    navigate(`/patient/${data.user._id}`);
                } else {
                    navigate('/doctor');
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            alert(error.message);
        }
    };

    return (
        <div style={styles.root}>
            <div style={styles.loginLayout}>
                <div style={styles.logoContainer}>
                    <img src={logo} alt="Logo" style={styles.logo} />
                    <h1 style={styles.title}>SCOPE</h1>
                </div>
                <div style={styles.userCredentials}>
                    <h2 style={styles.formHeader}>Login</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="username"
                            style={styles.input}
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                        />
                        <input
                            type="password"
                            name="password"
                            style={styles.input}
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <button
                            type="submit"
                            style={styles.button}
                            onMouseOver={(e) =>
                                (e.target.style.backgroundColor =
                                    styles.buttonHover.backgroundColor)
                            }
                            onMouseOut={(e) =>
                                (e.target.style.backgroundColor =
                                    styles.button.backgroundColor)
                            }
                        >
                            SIGN IN
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;