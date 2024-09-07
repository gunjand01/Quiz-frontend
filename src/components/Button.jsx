import PropTypes from 'prop-types';
import styles from './Button.module.css';

export default function Button({
  children,
  color = 'primary',
  variant,
  onClick,
  className,
  active,
}) {
  return (
    <button
      onClick={onClick}
      className={`${styles[color]} ${styles[variant]} ${styles.button} ${active ? styles.active : ''} ${className}`}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.string,
  toggle: PropTypes.func,
  color: PropTypes.oneOf(['primary', 'error', 'success', 'confirmDelete', 'cancel']),
  variant: PropTypes.oneOf(['outline', 'ghost', 'solid']),
  onClick: PropTypes.func,
  active: PropTypes.bool,
};
