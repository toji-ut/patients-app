import logo from '../assets/SCOPE logo.png';

function Header() {

    const styles = {
        containerLayout: {
            position: 'fixed',
            display: 'flex',
            flex: '1',
            height: '4.7rem',
            width: '100%',
            backgroundColor: '#2C3E50',
            justifyContent: 'center',
            top: 0,
            left: 0,
            alignItems: 'center',
            zIndex: 1,
            borderBottom:'4px solid',
        },
        logoContainer: {
            display:'flex',
            alignItems: 'center',
            marginRight: '1em',
        },
        logoLayout: {
            width:'3rem',
            height:'3rem',
            borderRadius: '90%',
        },
        logoText: {
            color: 'white',
            fontFamily: 'Poppins',
            fontSize: '3rem',
            fontWeight: 'bold',
        }

    };
    
    return (
    
    <div style={styles.containerLayout}>
        
        <div style={styles.logoContainer}>
            <img src={logo} style={styles.logoLayout} className="logo-pic" alt="Logo" />
        </div>

        <div>
            <h3 style={styles.logoText}>SCOPE</h3>
        </div>
    </div>
  );
}


export default Header;
