import styles from './Title.module.css';
import PropTypes from 'prop-types';

export default function Title({ children, toggleModal }) {
  return (
    <div className={styles.container}>
      <div onClick={toggleModal} className={styles.backdrop} />
      <div className={styles.content}>{children}</div>
    </div>
  );
}

Title.propTypes = {
  children: PropTypes.node,
  toggleModal: PropTypes.func,
};