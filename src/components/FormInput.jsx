import PropTypes from 'prop-types';
// import { Text } from './Text';

import styles from './FormInput.module.css';
import { useState } from 'react';

const checkType = (type) => {
  if (type === 'password') {
    return false;
  }

  return true;
};

export default function FormInput({
  register,
  error,
  label,
  type = 'text',
}) {
//   const [isVisible, setIsVisible] = useState(() => checkType(type));

  
  return (
    <div className={styles.container}>
      <label className={styles.label} htmlFor={label}>
        {label.charAt(0).toUpperCase() + label.slice(1)}
      </label>
      <div className={styles.input}>
        <input
          {...register(label)}
          type={ 'text' }
        />
      </div>
      <p className={styles.error}>{error?.message}</p>
    </div>
  );
}

FormInput.propTypes = {
  label: PropTypes.string.isRequired,
  error: PropTypes.object,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  mainIcon: PropTypes.element,
  secondaryIcon: PropTypes.element,
  register: PropTypes.any,
};