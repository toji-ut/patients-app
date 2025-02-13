import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const styles = {
        loginLayout: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            backgroundColor: 'blue',
            width: '100%',
            height: 'auto',
        },
        title: {
            color: 'white',
            textAlign: 'center',
            fontSize: '1rem',
            marginBottom: '8rem',
            marginTop: '8rem',
        },
        userCredentials: {
            backgroundColor: 'white',
            border: '2px solid',
            borderRadius: '0.3em',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            width: '95%',
        },
        credentialsLayout: {
            width: '100%',
            marginBottom: '1em',
        },
        credentials: {
            color: 'black',
            fontFamily: 'enriqueta',
            fontSize: '1em',
            fontWeight: 'bold',
            borderRadius: '0.3em',
        },
        button: {},
    };

    const [formData, setFormData] = useState({ username: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        })
            .then(response => response.json())
            .then(data => {
                if (data.redirect) {
                    navigate(data.redirect);
                } else {
                    console.error('Login failed');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    return (
        <div className="loginLayout" style={styles.loginLayout}>
            <div className="title" style={styles.title}>
                <h1>S C O P E</h1>
            </div>
            <div className="userCredentials" style={styles.userCredentials}>
                <div>
                    <h1>Login</h1>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="credentialsLayout" style={styles.credentialsLayout}>
                        <input
                            name="username"
                            className="credentials"
                            style={styles.credentials}
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="credentialsLayout" style={styles.credentialsLayout}>
                        <input
                            name="password"
                            type="password"
                            className="credentials"
                            style={styles.credentials}
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <button type="submit" className="button" style={styles.button}>
                            SIGN IN
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
