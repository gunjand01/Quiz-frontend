import PropTypes from 'prop-types';
import styles from './CustomInput.module.css'; // Import the CSS module

export default function CustomInput({ placeholder, value, onChange }) {
  return (
    <input
      className={styles.input}
      placeholder={placeholder}
      type="text"
      value={value}
      onChange={onChange}
    />
  );
}

CustomInput.propTypes = {
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};
