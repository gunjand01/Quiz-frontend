import PropTypes from 'prop-types';
import styles from './form.module.css';
import Button from '../../components/Button';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Form({ title, children }) {
  const location = useLocation();
  const [activeButton, setActiveButton] = useState('');

  useEffect(() => {
    if (location.pathname === '/register') {
      setActiveButton('Sign Up');
    } else {
      setActiveButton('Log In');
    }
  }, [location.pathname]);

  return (
    <div className={styles.container}>
      <div className={styles.navigation}>
        <div className={styles.buttonContainer}>
          <Link to="/register">
            <Button
              variant={activeButton === 'Sign Up' ? 'solid' : 'outline'}
              onClick={() => setActiveButton('Sign Up')}
              active={activeButton === 'Sign Up'}
            >
              Sign Up
            </Button>
          </Link>
          <Link to="/">
            <Button
              variant={activeButton === 'Log In' ? 'solid' : 'outline'}
              onClick={() => setActiveButton('Log In')}
              active={activeButton === 'Log In'}
            >
              Log In
            </Button>
          </Link>
        </div>
      </div>
      {children}
    </div>
  );
}

Form.propTypes = {
  title: PropTypes.oneOf(['Login', 'Register']).isRequired,
  children: PropTypes.node,
};
